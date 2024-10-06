import { BN, Program } from '@coral-xyz/anchor'
import { Keypair, PublicKey } from '@solana/web3.js'
import {
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { Itembox } from '../target/types/itembox'

export type ConsumeMethod = 'retain' | 'burn' | 'transfer'

export interface Ingredient {
  asset: PublicKey
  amount: BN
  consumeMethod: ConsumeMethod
}

interface RemainingAccount {
  pubkey: PublicKey
  isSigner: boolean
  isWritable: boolean
}

export class ItemboxSDK {
  constructor(public program: Program<Itembox>) {}

  async createBlueprint(
    nonFungible: boolean,
    name: string,
    uri: string,
    treasury: PublicKey,
    mintAuthority: PublicKey
  ) {
    const assetSigner = Keypair.generate()

    let signature: string

    if (nonFungible) {
      signature = await this.program.methods
        .createNonfungibleBlueprint({
          uri,
          name,
          treasury,
          mintAuthority,
        })
        .accounts({
          collection: assetSigner.publicKey,
          owner: this.program.provider.publicKey,
        })
        .signers([assetSigner])
        .rpc()
    } else {
      signature = await this.program.methods
        .createFungibleBlueprint({
          name,
          uri,
          treasury,
          mintAuthority,
          symbol: 'ITMBX',
        })
        .accounts({
          mint: assetSigner.publicKey,
          owner: this.program.provider.publicKey,
        })
        .signers([assetSigner])
        .rpc()
    }

    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('blueprint'), assetSigner.publicKey.toBytes()],
      this.program.programId
    )

    return {
      blueprint: pda,
      signature,
    }
  }

  async createRecipe(
    blueprint: PublicKey,
    ingredients: {
      asset: PublicKey
      amount: BN
      consumeMethod: 'retain' | 'burn' | 'transfer'
    }[],
    outputAmount = 1
  ) {
    const blueprintData = await this.program.account.blueprint.fetch(blueprint)
    const recipeSigner = Keypair.generate()

    if (blueprintData.nonFungible) {
      if (outputAmount > 1) {
        throw new Error(
          'Recipes cannot produce more than one non-fungible item'
        )
      }
      if (!Number.isInteger(outputAmount)) {
        throw new Error('Output amount must be an integer')
      }
    }

    const signature = await this.program.methods
      .createRecipe({
        outputAmount: new BN(outputAmount),
        ingredients: ingredients.map(({ amount, consumeMethod }) => ({
          amount,
          consumeMethod: { retain: 0, burn: 1, transfer: 2 }[consumeMethod],
        })),
      })
      .accounts({
        blueprint,
        recipeId: recipeSigner.publicKey,
      })
      .remainingAccounts(
        ingredients.map(({ asset }) => ({
          pubkey: asset,
          isSigner: false,
          isWritable: false,
        }))
      )
      .signers([recipeSigner])
      .rpc()

    const [pda] = PublicKey.findProgramAddressSync(
      [Buffer.from('recipe'), recipeSigner.publicKey.toBytes()],
      this.program.programId
    )

    return {
      recipe: pda,
      signature,
    }
  }

  async mintItem(blueprint: PublicKey, receiver: PublicKey, amount = '1') {
    const blueprintData = await this.program.account.blueprint.fetch(blueprint)
    const assetSigner = Keypair.generate()
    let asset: PublicKey
    let signature: string
    const amountBN = new BN(amount)

    if (blueprintData.nonFungible) {
      if (amountBN.gt(new BN(1))) {
        throw new Error('Cannot mint more than one non-fungible item')
      }

      signature = await this.program.methods
        .mintItem({
          amount: amountBN,
        })
        .accounts({
          assetSigner: assetSigner.publicKey,
          blueprint,
          receiver,
        })
        .accountsPartial({
          receiverAta: null,
        })
        .signers([assetSigner])
        .rpc()

      asset = assetSigner.publicKey
    } else {
      const receiverAta = getAssociatedTokenAddressSync(
        blueprintData.mint,
        receiver,
        false,
        TOKEN_2022_PROGRAM_ID
      )
      signature = await this.program.methods
        .mintItem({
          amount: amountBN,
        })
        .accounts({
          assetSigner: assetSigner.publicKey,
          blueprint,
          receiver,
        })
        .signers([assetSigner])
        .rpc()

      asset = receiverAta
    }

    return {
      nonFungible: blueprintData.nonFungible,
      asset,
      signature,
    }
  }

  async craftItem(
    recipe: PublicKey,
    nonFungibleIngredients: { collection: PublicKey; item: PublicKey }[]
  ) {
    if (!this.program.provider.publicKey) {
      throw new Error('Wallet is not connected')
    }

    const assetSigner = Keypair.generate()
    const recipeData = await this.program.account.recipe.fetch(recipe)
    const blueprintData = await this.program.account.blueprint.fetch(
      recipeData.blueprint
    )

    const blueprintIngredients = recipeData.ingredients.filter(
      ({ assetType }) => assetType === 0 || assetType === 1
    )
    // todo: fetch only slice of the mint address
    const blueprintIngredientAccounts =
      await this.program.account.blueprint.fetchMultiple(
        blueprintIngredients.map(({ asset }) => asset),
        'confirmed'
      )
    const hash = new Map<PublicKey, PublicKey>()
    const includedList: string[] = []
    const remainingAccounts: RemainingAccount[] = []

    const addToList = (address: PublicKey) => {
      const str = address.toBase58()
      if (!includedList.includes(str)) {
        includedList.push(str)
        remainingAccounts.push({
          pubkey: address,
          isSigner: false,
          isWritable: true,
        })
      }
    }

    blueprintIngredients.forEach((ingredient, index) => {
      hash.set(ingredient.asset, blueprintIngredientAccounts[index]!.mint)
    })

    recipeData.ingredients.forEach((ingredient) => {
      switch (ingredient.assetType) {
        // non-fungible
        case 0: {
          // include blueprint
          addToList(ingredient.asset)

          // include core collection
          const collection = hash.get(ingredient.asset)
          if (collection) {
            addToList(collection)
          } else {
            throw new Error(
              `${ingredient.asset} did not return collection address`
            )
          }

          // include the item address
          const itemEntry = nonFungibleIngredients.find((i) =>
            i.collection.equals(collection)
          )
          if (itemEntry) {
            addToList(itemEntry.item)
          } else {
            throw new Error(
              `Collection ${collection} was not found in the nonFungibleIngredients`
            )
          }

          // if transfer: add treasury
          if (ingredient.consumeMethod === 2) {
            addToList(blueprintData.treasury)
          }
          break
        }
        // fungible
        case 1: {
          // include blueprint
          addToList(ingredient.asset)

          // include mint
          const mint = hash.get(ingredient.asset)
          if (mint) {
            addToList(mint)
          } else {
            throw new Error(`${ingredient.asset} did not return mint address`)
          }

          // include owner ata of the mint, token2022
          const ownerAta = getAssociatedTokenAddressSync(
            mint,
            this.program.provider.publicKey!,
            true,
            TOKEN_2022_PROGRAM_ID
          )
          addToList(ownerAta)

          // if transfer: add treasury's ata of the mint, token2022
          if (ingredient.consumeMethod === 2) {
            const receiverAta = getAssociatedTokenAddressSync(
              mint,
              blueprintData.treasury,
              true,
              TOKEN_2022_PROGRAM_ID
            )
            addToList(receiverAta)
          }
          break
        }
        // spl token
        case 2: {
          // include ingredient.asset (mint)
          const mint = ingredient.asset
          addToList(mint)

          // include owner ata
          const ownerAta = getAssociatedTokenAddressSync(
            mint,
            this.program.provider.publicKey!,
            true
          )
          addToList(ownerAta)

          // if transfer: add treasury's ata
          if (ingredient.consumeMethod === 2) {
            const receiverAta = getAssociatedTokenAddressSync(
              mint,
              blueprintData.treasury,
              true
            )
            addToList(receiverAta)
          }
          break
        }
        // token2022
        case 3: {
          // include ingredient.asset (mint)
          const mint = ingredient.asset
          addToList(mint)

          // include owner ata of the mint, token2022
          const ownerAta = getAssociatedTokenAddressSync(
            mint,
            this.program.provider.publicKey!,
            true,
            TOKEN_2022_PROGRAM_ID
          )
          addToList(ownerAta)

          // if transfer: add treasury's ata of the mint, token2022
          if (ingredient.consumeMethod === 2) {
            const receiverAta = getAssociatedTokenAddressSync(
              mint,
              blueprintData.treasury,
              true,
              TOKEN_2022_PROGRAM_ID
            )
            addToList(receiverAta)
          }
          break
        }
      }
    })

    let ix = this.program.methods
      .craftItem({
        itemsRef: nonFungibleIngredients,
      })
      .accounts({
        recipe,
        assetSigner: assetSigner.publicKey,
        owner: this.program.provider.publicKey,
      })
      .remainingAccounts(remainingAccounts)
      .signers([assetSigner])

    let asset: PublicKey
    if (blueprintData.nonFungible) {
      ix = ix.accountsPartial({
        ownerAta: null,
      })
      asset = assetSigner.publicKey
    } else {
      asset = getAssociatedTokenAddressSync(
        blueprintData.mint,
        this.program.provider.publicKey,
        true,
        TOKEN_2022_PROGRAM_ID
      )
    }

    const signature = await ix.rpc()

    return {
      nonFungible: blueprintData.nonFungible,
      asset,
      signature,
    }
  }

  // note: all of these items below can be done on the frontend side
  // as they need caching of the results, and jotai atoms can do
  // batch requests anyway if needed

  // todo: craftItemWithAnyIngredients
  // todo: given recipe, extract available non-fungible ingredients
  // - use umi, fetch collection
  // todo: check if recipe is craftable given owner's wallet
  // - use umi, fetch collection
}
