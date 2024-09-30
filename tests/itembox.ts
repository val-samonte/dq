import {
  AnchorProvider,
  BN,
  Program,
  setProvider,
  workspace,
} from '@coral-xyz/anchor'
import { Itembox } from '../target/types/itembox'
import { loadKeypair } from './utils'
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  ComputeBudgetProgram,
} from '@solana/web3.js'
import { assert, expect } from 'chai'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import {
  fetchAsset,
  fetchCollection,
  mplCore,
} from '@metaplex-foundation/mpl-core'
import {
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import {
  createMint,
  getAccount,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  getMetadataPointerState,
  getMint,
  getOrCreateAssociatedTokenAccount,
  getTokenMetadata,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { IDL } from '@coral-xyz/anchor/dist/cjs/native/system'
// import { StateWithExtensions, MintExtensionType } from '@solana/spl-token-extensions';

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

describe('DeezQuest: Itembox Program', () => {
  setProvider(AnchorProvider.env())

  const program = workspace.Itembox as Program<Itembox>
  const authority = loadKeypair('~/.config/solana/id.json')
  const treasuryKeypair = Keypair.generate()
  const blueprintTreasuryKeypair = Keypair.generate()
  const swordBP = Keypair.generate()
  const refinedCopperBP = Keypair.generate()
  const hiltBP = Keypair.generate()
  const hilt = Keypair.generate()
  const copperBlockBP = Keypair.generate()
  const recipeSignerId = Keypair.generate()
  const token = Keypair.generate()

  let splTokenMintIngredient: PublicKey
  let ownerSplAta: PublicKey
  let treasurySplAta: PublicKey
  let refinedCopperAta: PublicKey
  let treasuryCopperAta: PublicKey

  const umi = createUmi(program.provider.connection.rpcEndpoint, 'confirmed')
  umi.use(mplCore())

  const authorityUmiKp = umi.eddsa.createKeypairFromSecretKey(
    authority.secretKey
  )
  umi.use(signerIdentity(createSignerFromKeypair(umi, authorityUmiKp)))

  const [mainPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('main')],
    program.programId
  )

  const [swordBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), swordBP.publicKey.toBytes()],
    program.programId
  )

  const [refinedCopperBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), refinedCopperBP.publicKey.toBytes()],
    program.programId
  )

  const [hiltBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), hiltBP.publicKey.toBytes()],
    program.programId
  )

  const [copperBlockBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), copperBlockBP.publicKey.toBytes()],
    program.programId
  )

  const [recipePda] = PublicKey.findProgramAddressSync(
    [Buffer.from('recipe'), recipeSignerId.publicKey.toBytes()],
    program.programId
  )

  console.log(
    '======================================================================'
  )
  console.log('Itembox Program ID', program.programId.toBase58())
  console.log('Itembox Main Pda', mainPda.toBase58())
  console.log('Blueprint Collection ID', swordBP.publicKey.toBase58())

  before(async () => {
    // fund treasury
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: treasuryKeypair.publicKey,
        lamports: 2 * LAMPORTS_PER_SOL,
      }),
      SystemProgram.transfer({
        fromPubkey: authority.publicKey,
        toPubkey: blueprintTreasuryKeypair.publicKey,
        lamports: 2 * LAMPORTS_PER_SOL,
      })
    )

    await program.provider.sendAndConfirm(tx)

    await program.provider.sendAndConfirm(tx)

    splTokenMintIngredient = await createMint(
      program.provider.connection,
      authority,
      authority.publicKey,
      authority.publicKey,
      9
    )

    ownerSplAta = (
      await getOrCreateAssociatedTokenAccount(
        program.provider.connection,
        authority,
        splTokenMintIngredient,
        authority.publicKey
      )
    ).address

    treasurySplAta = await getAssociatedTokenAddress(
      splTokenMintIngredient,
      blueprintTreasuryKeypair.publicKey
    )

    refinedCopperAta = await getAssociatedTokenAddress(
      refinedCopperBP.publicKey,
      authority.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    )

    treasuryCopperAta = await getAssociatedTokenAddress(
      refinedCopperBP.publicKey,
      blueprintTreasuryKeypair.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    )

    await mintTo(
      program.provider.connection,
      authority,
      splTokenMintIngredient,
      ownerSplAta,
      authority,
      1000 * 10 ** 9
    )
  })

  it('initialize main', async () => {
    await program.methods
      .init({
        blueprintMintFee: new BN(0.0002 * LAMPORTS_PER_SOL),
        tokenMint: token.publicKey,
        treasury: treasuryKeypair.publicKey,
      })
      .accounts({
        authority: authority.publicKey,
      })
      .rpc()
    const main = await program.account.main.fetch(mainPda)
    expect(main.authority.equals(program.provider.publicKey)).eq(true)
  })

  it('creates a non-fungible blueprint', async () => {
    const blueprintName = 'Copper Sword'

    await program.methods
      .createNonfungibleBlueprint({
        mintAuthority: authority.publicKey,
        treasury: blueprintTreasuryKeypair.publicKey,
        name: blueprintName,
        uri: 'https://example.com/metadata.json',
      })
      .accounts({
        collection: swordBP.publicKey,
        owner: authority.publicKey,
      })
      .signers([swordBP])
      .rpc()

    await sleep(1000)

    const blueprintMetadata = await fetchCollection(
      umi,
      fromWeb3JsPublicKey(swordBP.publicKey)
    )

    expect(blueprintMetadata.name).eq(blueprintName)
    expect(blueprintMetadata.uri).eq('https://example.com/metadata.json')
  })

  it('creates a non-fungible blueprint (resource)', async () => {
    const blueprintName = 'Hilt'

    await program.methods
      .createNonfungibleBlueprint({
        mintAuthority: authority.publicKey,
        treasury: blueprintTreasuryKeypair.publicKey,
        name: blueprintName,
        uri: 'https://example.com/metadata.json',
      })
      .accounts({
        collection: hiltBP.publicKey,
        owner: authority.publicKey,
      })
      .signers([hiltBP])
      .rpc()

    await sleep(1000)

    const blueprintMetadata = await fetchCollection(
      umi,
      fromWeb3JsPublicKey(hiltBP.publicKey)
    )

    expect(blueprintMetadata.name).eq(blueprintName)
    expect(blueprintMetadata.uri).eq('https://example.com/metadata.json')

    const hiltData = await program.account.blueprint.fetch(hiltBlueprintPda)
    console.log('Hilt mint address', hiltData.mint.toBase58())
  })

  it('creates a fungible blueprint', async () => {
    const blueprintName = 'Copper Block'

    await program.methods
      .createFungibleBlueprint({
        mintAuthority: authority.publicKey,
        treasury: blueprintTreasuryKeypair.publicKey,
        name: blueprintName,
        uri: 'https://example.com/metadata.json',
        symbol: 'DQT',
      })
      .accounts({
        mint: copperBlockBP.publicKey,
        owner: authority.publicKey,
      })
      .signers([copperBlockBP])
      .rpc()

    await sleep(1000)

    const mintInfo = await getMint(
      program.provider.connection,
      copperBlockBP.publicKey,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    const metadataPointer = getMetadataPointerState(mintInfo)
    expect(metadataPointer.metadataAddress.equals(copperBlockBP.publicKey)).eq(
      true
    )

    const metadata = await getTokenMetadata(
      program.provider.connection,
      metadataPointer.metadataAddress // Mint Account address
    )

    expect(metadata.name).eq(blueprintName)
    expect(metadata.symbol).eq('DQT')
    expect(metadata.uri).eq('https://example.com/metadata.json')
  })

  it('creates a fungible blueprint (resource)', async () => {
    const blueprintName = 'Refined Copper'

    await program.methods
      .createFungibleBlueprint({
        mintAuthority: authority.publicKey,
        treasury: blueprintTreasuryKeypair.publicKey,
        name: blueprintName,
        uri: 'https://example.com/metadata.json',
        symbol: 'DQT',
      })
      .accounts({
        mint: refinedCopperBP.publicKey,
        owner: authority.publicKey,
      })
      .signers([refinedCopperBP])
      .rpc()

    await sleep(1000)

    const mintInfo = await getMint(
      program.provider.connection,
      refinedCopperBP.publicKey,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    console.log('Refined copper: ', refinedCopperBP.publicKey.toBase58())

    const metadataPointer = getMetadataPointerState(mintInfo)
    expect(
      metadataPointer.metadataAddress.equals(refinedCopperBP.publicKey)
    ).eq(true)

    const metadata = await getTokenMetadata(
      program.provider.connection,
      metadataPointer.metadataAddress // Mint Account address
    )

    expect(metadata.name).eq(blueprintName)
    expect(metadata.symbol).eq('DQT')
    expect(metadata.uri).eq('https://example.com/metadata.json')
  })

  it('mints a non-fungible blueprint', async () => {
    await program.methods
      .mintItem({
        amount: new BN(1),
      })
      .accounts({
        blueprint: hiltBlueprintPda,
        assetSigner: hilt.publicKey,
        receiver: authority.publicKey,
      })
      .accountsPartial({
        receiverAta: null,
      })
      .signers([hilt])
      .rpc()

    await sleep(1000)

    const asset = await fetchAsset(umi, fromWeb3JsPublicKey(hilt.publicKey), {
      skipDerivePlugins: false,
    })

    expect(asset.name).eq('Hilt')
    expect(asset.uri).eq('https://example.com/metadata.json')
    expect(asset.owner.toString()).eq(authority.publicKey.toString())
  })

  it('mints a fungible blueprint', async () => {
    const assetSigner = Keypair.generate()
    const amount = new BN(1000)

    await program.methods
      .mintItem({
        amount,
      })
      .accounts({
        assetSigner: assetSigner.publicKey,
        blueprint: refinedCopperBlueprintPda,
        receiver: authority.publicKey,
      })
      .signers([assetSigner])
      .rpc()

    await sleep(1000)

    const tokenAccount = await getAccount(
      program.provider.connection,
      refinedCopperAta,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    expect(tokenAccount.amount).eq(1000n)
  })

  it('creates a recipe for a non-fungible item', async () => {
    console.log('Recipe id', recipeSignerId.publicKey.toBase58())
    const ingredients = [
      {
        asset: splTokenMintIngredient,
        amount: new BN(10),
        consumeMethod: 2,
      },
      {
        asset: refinedCopperBlueprintPda,
        amount: new BN(10),
        consumeMethod: 1,
      },
      {
        asset: hiltBlueprintPda,
        amount: new BN(1),
        consumeMethod: 2,
      },
    ]

    // const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    //   units: 1000000,
    // })

    // const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    //   microLamports: 1,
    // })

    const ix = await program.methods
      .createRecipe({
        outputAmount: new BN(1),
        ingredients: ingredients.map(({ asset, ...ing }) => ing),
      })
      .accounts({
        blueprint: swordBlueprintPda,
        recipeId: recipeSignerId.publicKey,
      })
      .remainingAccounts(
        ingredients.map((ing) => {
          return {
            pubkey: ing.asset,
            isSigner: false,
            isWritable: false,
          }
        })
      )
      // .signers([recipeSignerId])
      // .rpc()
      .instruction()

    const tx = new Transaction()
      // .add(modifyComputeUnits)
      // .add(addPriorityFee)
      .add(ix)

    await program.provider.sendAndConfirm(tx, [recipeSignerId])

    const recipeData = await program.account.recipe.fetch(recipePda)

    expect(recipeData.blueprint.equals(swordBlueprintPda)).eq(true)

    ingredients.forEach((ing, i) => {
      expect(recipeData.ingredients[i].asset.equals(ing.asset)).eq(true)
      expect(recipeData.ingredients[i].amount.eq(ing.amount)).eq(true)
      expect(recipeData.ingredients[i].consumeMethod).eq(ing.consumeMethod)
    })
  })

  it('crafts an non-fungible item', async () => {
    const assetSigner = Keypair.generate()

    // const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    //   units: 1000000,
    // })

    // const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    //   microLamports: 1,
    // })

    console.log('Refined Copper Sender', refinedCopperAta.toBase58())
    console.log(
      'Blueprint Treasury',
      blueprintTreasuryKeypair.publicKey.toBase58()
    )

    const ix = await program.methods
      .craftItem({
        itemsRef: [
          {
            collection: hiltBP.publicKey,
            item: hilt.publicKey,
          },
        ],
      })
      .accounts({
        recipe: recipePda,
        assetSigner: assetSigner.publicKey,
        owner: authority.publicKey,
      })
      .accountsPartial({
        ownerAta: null,
      })
      .remainingAccounts([
        // SPL Token (transfer)
        {
          // mint
          pubkey: splTokenMintIngredient,
          isSigner: false,
          isWritable: true,
        },
        {
          // sender
          pubkey: ownerSplAta,
          isSigner: false,
          isWritable: true,
        },
        {
          // receiver
          pubkey: treasurySplAta,
          isSigner: false,
          isWritable: true,
        },
        // Refined Copper (Blueprint Fungible) (burn)
        {
          // blueprint
          pubkey: refinedCopperBlueprintPda,
          isSigner: false,
          isWritable: true,
        },
        {
          // mint
          pubkey: refinedCopperBP.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          // sender
          pubkey: refinedCopperAta,
          isSigner: false,
          isWritable: true,
        },
        {
          // receiver
          pubkey: treasuryCopperAta,
          isSigner: false,
          isWritable: true,
        },
        // Hilt
        {
          // blueprint
          pubkey: hiltBlueprintPda,
          isSigner: false,
          isWritable: true,
        },
        {
          // collection
          pubkey: hiltBP.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          // item
          pubkey: hilt.publicKey,
          isSigner: false,
          isWritable: true,
        },
        {
          // receiver
          pubkey: blueprintTreasuryKeypair.publicKey,
          isSigner: false,
          isWritable: true,
        },
      ])
      .instruction()
    // .signers([assetSigner])
    // .rpc()

    const tx = new Transaction()
      // .add(modifyComputeUnits)
      // .add(addPriorityFee)
      .add(ix)

    await program.provider.sendAndConfirm(tx, [assetSigner])

    await sleep(1000)

    const tokenAccountPost = await getAccount(
      program.provider.connection,
      ownerSplAta
    )

    const copperTokenAccountPost = await getAccount(
      program.provider.connection,
      refinedCopperAta,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    const asset = await fetchAsset(
      umi,
      fromWeb3JsPublicKey(assetSigner.publicKey),
      {
        skipDerivePlugins: false,
      }
    )

    expect(tokenAccountPost.amount).eq(990000000000n)
    expect(copperTokenAccountPost.amount).eq(990n)
    expect(asset.name).eq('Copper Sword')
    expect(asset.uri).eq('https://example.com/metadata.json')
    expect(asset.owner.toString()).eq(authority.publicKey.toString())
  })

  xit('crafts a fungible item', async () => {})

  // ✅ Burn Blueprint Non-Fungible Ingredient
  // ✅ Burn Blueprint Fungible Ingredient
  // ✅ Burn SPL Ingredient
  // Burn Token2022 Ingredient
  // ✅ Transfer Blueprint Non-Fungible Ingredient
  // ✅ Transfer Blueprint Fungible Ingredient
  // ✅ Transfer SPL Ingredient
  // Transfer Token2022 Ingredient
  // ✅ Multiple ingredients
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
      amount: number
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
          amount: new BN(amount),
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

    return {
      recipe: recipeSigner.publicKey,
      signature,
    }
  }

  async mintItem(blueprint: PublicKey, receiver: PublicKey, amount = 1) {
    const blueprintData = await this.program.account.blueprint.fetch(blueprint)
    const assetSigner = Keypair.generate()
    let asset: PublicKey
    let signature: string

    if (blueprintData.nonFungible) {
      if (amount > 1) {
        throw new Error('Cannot mint more than one non-fungible item')
      }
      if (!Number.isInteger(amount)) {
        throw new Error('Amount must be an integer')
      }

      await this.program.methods
        .mintItem({
          amount: new BN(1),
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
      const receiverAta = await getAssociatedTokenAddress(
        blueprintData.mint,
        receiver,
        false,
        TOKEN_2022_PROGRAM_ID
      )
      signature = await this.program.methods
        .mintItem({
          amount: new BN(amount),
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

  // todo: given recipe, extract available non-fungible ingredients
  // - use umi, fetch collection

  // todo: check if recipe is craftable given owner's wallet
  // - use umi, fetch collection

  async craftItem(
    recipe: PublicKey,
    nonFungibleIngredients: { collection: PublicKey; item: PublicKey }[]
  ) {
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
          const itemEntry = nonFungibleIngredients.find(
            (i) => i.collection === collection
          )
          if (itemEntry) {
            addToList(itemEntry.item)
          } else {
            throw new Error(
              `Collection ${collection} was not found in the nonFungibleIngredients`
            )
          }

          // if transfer: add treasury
          if (ingredient.consumeMethod === 3) {
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
            this.program.provider.publicKey,
            true,
            TOKEN_2022_PROGRAM_ID
          )
          addToList(ownerAta)

          // if transfer: add treasury's ata of the mint, token2022
          if (ingredient.consumeMethod === 3) {
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
            this.program.provider.publicKey,
            true
          )
          addToList(ownerAta)

          // if transfer: add treasury's ata
          if (ingredient.consumeMethod === 3) {
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
            this.program.provider.publicKey,
            true,
            TOKEN_2022_PROGRAM_ID
          )
          addToList(ownerAta)

          // if transfer: add treasury's ata of the mint, token2022
          if (ingredient.consumeMethod === 3) {
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

  // todo: craftItemWithAnyIngredients
}
