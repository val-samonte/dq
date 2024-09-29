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
  getMetadataPointerState,
  getMint,
  getOrCreateAssociatedTokenAccount,
  getTokenMetadata,
  mintTo,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
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
  const sword = Keypair.generate()
  const refinedCopper = Keypair.generate()
  const hilt = Keypair.generate()
  const copperBlock = Keypair.generate()
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
    [Buffer.from('blueprint'), sword.publicKey.toBytes()],
    program.programId
  )

  const [refinedCopperBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), refinedCopper.publicKey.toBytes()],
    program.programId
  )

  const [hiltBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), hilt.publicKey.toBytes()],
    program.programId
  )

  const [copperBlockBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), copperBlock.publicKey.toBytes()],
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
  console.log('Blueprint Collection ID', sword.publicKey.toBase58())

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
      refinedCopper.publicKey,
      authority.publicKey,
      false,
      TOKEN_2022_PROGRAM_ID
    )

    treasuryCopperAta = await getAssociatedTokenAddress(
      refinedCopper.publicKey,
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
        collection: sword.publicKey,
        owner: authority.publicKey,
      })
      .signers([sword])
      .rpc()

    await sleep(1000)

    const blueprintMetadata = await fetchCollection(
      umi,
      fromWeb3JsPublicKey(sword.publicKey)
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
        collection: hilt.publicKey,
        owner: authority.publicKey,
      })
      .signers([hilt])
      .rpc()

    await sleep(1000)

    const blueprintMetadata = await fetchCollection(
      umi,
      fromWeb3JsPublicKey(hilt.publicKey)
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
        mint: copperBlock.publicKey,
        owner: authority.publicKey,
      })
      .signers([copperBlock])
      .rpc()

    await sleep(1000)

    const mintInfo = await getMint(
      program.provider.connection,
      copperBlock.publicKey,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    const metadataPointer = getMetadataPointerState(mintInfo)
    expect(metadataPointer.metadataAddress.equals(copperBlock.publicKey)).eq(
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
        mint: refinedCopper.publicKey,
        owner: authority.publicKey,
      })
      .signers([refinedCopper])
      .rpc()

    await sleep(1000)

    const mintInfo = await getMint(
      program.provider.connection,
      refinedCopper.publicKey,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    console.log('Refined copper: ', refinedCopper.publicKey.toBase58())

    const metadataPointer = getMetadataPointerState(mintInfo)
    expect(metadataPointer.metadataAddress.equals(refinedCopper.publicKey)).eq(
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

  it('mints a non-fungible blueprint', async () => {
    const assetSigner = Keypair.generate()

    await program.methods
      .mintItem({
        amount: new BN(1),
      })
      .accounts({
        blueprint: hiltBlueprintPda,
        assetSigner: assetSigner.publicKey,
        receiver: authority.publicKey,
      })
      .accountsPartial({
        receiverAta: null,
      })
      .signers([assetSigner])
      .rpc()

    await sleep(1000)

    const asset = await fetchAsset(
      umi,
      fromWeb3JsPublicKey(assetSigner.publicKey),
      {
        skipDerivePlugins: false,
      }
    )

    expect(asset.name).eq('Hilt')
    expect(asset.uri).eq('https://example.com/metadata.json')
    expect(asset.owner.toString()).eq(authority.publicKey.toString())
  })

  it('mints a fungible blueprint', async () => {
    const amount = new BN(1000)
    const assetSigner = Keypair.generate()

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
        name: 'SPL Token',
        asset: splTokenMintIngredient,
        amount: new BN(10),
        consumeMethod: 2,
      },
      {
        name: 'Refined Copper',
        asset: refinedCopperBlueprintPda,
        amount: new BN(10),
        consumeMethod: 2,
      },
      // {
      //   asset: hiltBlueprintPda,
      //   amount: new BN(1),
      //   consumeMethod: 1,
      // }
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
          console.log(ing.name, ing.asset.toBase58())
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

    const tokenAccount = await getAccount(
      program.provider.connection,
      ownerSplAta
    )
    console.log(tokenAccount.amount)

    // const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
    //   units: 1000000,
    // })

    // const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
    //   microLamports: 1,
    // })

    console.log('Refined Copper Sender', refinedCopperAta.toBase58())

    const ix = await program.methods
      .craftItem()
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
          pubkey: refinedCopper.publicKey,
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

  // Burn Blueprint Non-Fungible Ingredient
  // ✅ Burn Blueprint Fungible Ingredient
  // ✅ Burn SPL Ingredient
  // Burn Token2022 Ingredient
  // Transfer Blueprint Non-Fungible Ingredient
  // Transfer Blueprint Fungible Ingredient
  // ✅ Transfer SPL Ingredient
  // Transfer Token2022 Ingredient
  // Multiple ingredients
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
