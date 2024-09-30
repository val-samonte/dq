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
import { Ingredient, ItemboxSDK } from './sdk'
// import { StateWithExtensions, MintExtensionType } from '@solana/spl-token-extensions';

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

describe('DeezQuest: Itembox Program', () => {
  setProvider(AnchorProvider.env())

  const program = workspace.Itembox as Program<Itembox>
  const sdk = new ItemboxSDK(program)
  const authority = loadKeypair('~/.config/solana/id.json')
  const treasuryKeypair = Keypair.generate()
  const blueprintTreasuryKeypair = Keypair.generate()
  const daoTokenMint = Keypair.generate()

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

  const commonUri = 'https://example.com/metadata.json'

  let splTokenMintIngredient: PublicKey
  let copperSwordBlueprint: PublicKey
  let hiltBlueprint: PublicKey
  let refinedCopperBlueprint: PublicKey
  let copperBlockBlueprint: PublicKey
  let copperSwordRecipe: PublicKey
  let copperBlockRecipe: PublicKey
  let hilt: PublicKey
  let refinedCopper: PublicKey

  console.log(
    '======================================================================'
  )
  console.log('Itembox Program ID', program.programId.toBase58())
  console.log('Itembox Main Pda', mainPda.toBase58())

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

    splTokenMintIngredient = await createMint(
      program.provider.connection,
      authority,
      authority.publicKey,
      authority.publicKey,
      9
    )
  })

  it('initialize main', async () => {
    await program.methods
      .init({
        blueprintMintFee: new BN(0.0002 * LAMPORTS_PER_SOL),
        tokenMint: daoTokenMint.publicKey,
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
    const { blueprint } = await sdk.createBlueprint(
      true,
      'Copper Sword',
      commonUri,
      blueprintTreasuryKeypair.publicKey,
      authority.publicKey
    )

    await sleep(500)

    const data = await program.account.blueprint.fetch(blueprint)

    const metadata = await fetchCollection(umi, fromWeb3JsPublicKey(data.mint))

    expect(metadata.name).eq('Copper Sword')
    expect(metadata.uri).eq(commonUri)

    copperSwordBlueprint = blueprint
    console.log('Copper Sword Blueprint', copperSwordBlueprint.toBase58())
  })

  it('creates a non-fungible blueprint (resource)', async () => {
    const { blueprint } = await sdk.createBlueprint(
      true,
      'Hilt',
      commonUri,
      blueprintTreasuryKeypair.publicKey,
      authority.publicKey
    )

    await sleep(500)

    const data = await program.account.blueprint.fetch(blueprint)

    const metadata = await fetchCollection(umi, fromWeb3JsPublicKey(data.mint))

    expect(metadata.name).eq('Hilt')
    expect(metadata.uri).eq(commonUri)

    hiltBlueprint = blueprint
    console.log('Hilt Blueprint', hiltBlueprint.toBase58())
  })

  it('creates a fungible blueprint', async () => {
    const { blueprint } = await sdk.createBlueprint(
      false,
      'Copper Block',
      commonUri,
      blueprintTreasuryKeypair.publicKey,
      authority.publicKey
    )

    await sleep(500)

    const data = await program.account.blueprint.fetch(blueprint)

    const mintInfo = await getMint(
      program.provider.connection,
      data.mint,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    const metadataPointer = getMetadataPointerState(mintInfo)
    expect(metadataPointer.metadataAddress.equals(data.mint)).eq(true)
    const metadata = await getTokenMetadata(
      program.provider.connection,
      metadataPointer.metadataAddress
    )
    expect(metadata.name).eq('Copper Block')
    expect(metadata.symbol).eq('ITMBX')
    expect(metadata.uri).eq(commonUri)

    copperBlockBlueprint = blueprint
    console.log('Copper Block Blueprint', copperBlockBlueprint.toBase58())
  })

  it('creates a fungible blueprint (resource)', async () => {
    const { blueprint } = await sdk.createBlueprint(
      false,
      'Refined Copper',
      commonUri,
      blueprintTreasuryKeypair.publicKey,
      authority.publicKey
    )

    await sleep(500)

    const data = await program.account.blueprint.fetch(blueprint)

    const mintInfo = await getMint(
      program.provider.connection,
      data.mint,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    const metadataPointer = getMetadataPointerState(mintInfo)
    expect(metadataPointer.metadataAddress.equals(data.mint)).eq(true)
    const metadata = await getTokenMetadata(
      program.provider.connection,
      metadataPointer.metadataAddress
    )
    expect(metadata.name).eq('Refined Copper')
    expect(metadata.symbol).eq('ITMBX')
    expect(metadata.uri).eq(commonUri)

    refinedCopperBlueprint = blueprint
    console.log('Refined Copper Blueprint', refinedCopperBlueprint.toBase58())
  })

  it('mints a non-fungible blueprint', async () => {
    const { asset } = await sdk.mintItem(hiltBlueprint, authority.publicKey)

    await sleep(500)

    const data = await fetchAsset(umi, fromWeb3JsPublicKey(asset), {
      skipDerivePlugins: false,
    })

    expect(data.name).eq('Hilt')
    expect(data.uri).eq(commonUri)
    expect(data.owner.toString()).eq(authority.publicKey.toString())

    hilt = asset
    console.log('Hilt', hilt.toBase58())
  })

  it('mints a fungible blueprint', async () => {
    const { asset } = await sdk.mintItem(
      refinedCopperBlueprint,
      authority.publicKey,
      1000
    )

    await sleep(500)

    const tokenAccount = await getAccount(
      program.provider.connection,
      asset,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    expect(tokenAccount.amount).eq(1000n)

    refinedCopper = asset
    console.log('Refined Copper', refinedCopper.toBase58())
  })

  it('creates a recipe for a non-fungible item', async () => {
    const ingredients: Ingredient[] = [
      {
        asset: splTokenMintIngredient,
        amount: 10,
        consumeMethod: 'transfer',
      },
      {
        asset: refinedCopperBlueprint,
        amount: 10,
        consumeMethod: 'burn',
      },
      {
        asset: hiltBlueprint,
        amount: 1,
        consumeMethod: 'burn',
      },
    ]

    const { recipe } = await sdk.createRecipe(copperSwordBlueprint, ingredients)

    await sleep(1000)

    const data = await program.account.recipe.fetch(recipe)
    expect(data.blueprint.equals(copperSwordBlueprint)).eq(true)

    ingredients.forEach((ing, i) => {
      expect(data.ingredients[i].asset.equals(ing.asset)).eq(true)
      expect(data.ingredients[i].amount.toNumber()).eq(ing.amount)
      expect(
        ['retain', 'burn', 'transfer'][data.ingredients[i].consumeMethod]
      ).eq(ing.consumeMethod)
    })

    copperSwordRecipe = recipe
    console.log('Copper Sword Recipe', copperSwordRecipe.toBase58())
  })

  it('creates a recipe for a fungible item', async () => {
    const ingredients: Ingredient[] = [
      {
        asset: splTokenMintIngredient,
        amount: 10,
        consumeMethod: 'retain',
      },
      {
        asset: refinedCopperBlueprint,
        amount: 10,
        consumeMethod: 'retain',
      },
    ]

    const { recipe } = await sdk.createRecipe(copperBlockBlueprint, ingredients)

    await sleep(1000)

    const data = await program.account.recipe.fetch(recipe)
    expect(data.blueprint.equals(copperBlockBlueprint)).eq(true)

    ingredients.forEach((ing, i) => {
      expect(data.ingredients[i].asset.equals(ing.asset)).eq(true)
      expect(data.ingredients[i].amount.toNumber()).eq(ing.amount)
      expect(
        ['retain', 'burn', 'transfer'][data.ingredients[i].consumeMethod]
      ).eq(ing.consumeMethod)
    })

    copperBlockRecipe = recipe
    console.log('Copper Block Recipe', copperBlockRecipe.toBase58())
  })

  xit('crafts an non-fungible item', async () => {
    // await sleep(1000)
    // const tokenAccountPost = await getAccount(
    //   program.provider.connection,
    //   ownerSplAta
    // )
    // const copperTokenAccountPost = await getAccount(
    //   program.provider.connection,
    //   refinedCopperAta,
    //   'confirmed',
    //   TOKEN_2022_PROGRAM_ID
    // )
    // const asset = await fetchAsset(
    //   umi,
    //   fromWeb3JsPublicKey(assetSigner.publicKey),
    //   {
    //     skipDerivePlugins: false,
    //   }
    // )
    // expect(tokenAccountPost.amount).eq(990000000000n)
    // expect(copperTokenAccountPost.amount).eq(990n)
    // expect(asset.name).eq('Copper Sword')
    // expect(asset.uri).eq('https://example.com/metadata.json')
    // expect(asset.owner.toString()).eq(authority.publicKey.toString())
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
