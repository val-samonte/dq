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
} from '@solana/web3.js'
import { expect } from 'chai'
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
  const swordBlueprint = Keypair.generate()
  const refinedCopperBlueprint = Keypair.generate()
  const recipeSignerId = Keypair.generate()
  const token = Keypair.generate()
  const blueprintTreasuryKeypair = Keypair.generate()

  let splTokenMintIngredient: PublicKey
  let ownerSplAta: PublicKey

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
    [Buffer.from('blueprint'), swordBlueprint.publicKey.toBytes()],
    program.programId
  )

  const [refinedCopperBlueprintPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('blueprint'), refinedCopperBlueprint.publicKey.toBytes()],
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
  console.log('Blueprint Collection ID', swordBlueprint.publicKey.toBase58())

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
        collection: swordBlueprint.publicKey,
        owner: authority.publicKey,
      })
      .signers([swordBlueprint])
      .rpc()

    await sleep(1000)

    const blueprintMetadata = await fetchCollection(
      umi,
      fromWeb3JsPublicKey(swordBlueprint.publicKey)
    )

    expect(blueprintMetadata.name).eq(blueprintName)
    expect(blueprintMetadata.uri).eq('https://example.com/metadata.json')
  })

  it('creates a fungible blueprint', async () => {
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
        mint: refinedCopperBlueprint.publicKey,
        owner: authority.publicKey,
      })
      .signers([refinedCopperBlueprint])
      .rpc()

    await sleep(1000)

    const mintInfo = await getMint(
      program.provider.connection,
      refinedCopperBlueprint.publicKey,
      'confirmed',
      TOKEN_2022_PROGRAM_ID
    )

    const metadataPointer = getMetadataPointerState(mintInfo)
    expect(
      metadataPointer.metadataAddress.equals(refinedCopperBlueprint.publicKey)
    ).eq(true)

    const metadata = await getTokenMetadata(
      program.provider.connection,
      metadataPointer.metadataAddress // Mint Account address
    )

    expect(metadata.name).eq(blueprintName)
    expect(metadata.symbol).eq('DQT')
    expect(metadata.uri).eq('https://example.com/metadata.json')
  })

  it('creates a recipe', async () => {
    // todo:
    // 1. add blueprint ingredient
    // 2. add token2022 ingredient
    const ingredients = [
      {
        asset: splTokenMintIngredient,
        amount: new BN(10), // normalized amount
        consumeMethod: 1,
      },
    ]

    await program.methods
      .createRecipe({
        outputAmount: new BN(1),
        ingredients: ingredients.map(({ asset, ...ing }) => ing),
      })
      .accounts({
        blueprint: swordBlueprintPda,
        recipeId: recipeSignerId.publicKey,
      })
      .remainingAccounts(
        ingredients.map((ing) => ({
          pubkey: ing.asset,
          isSigner: false,
          isWritable: false,
        }))
      )
      .signers([recipeSignerId])
      .rpc()

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

    await program.methods
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
        {
          pubkey: splTokenMintIngredient,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: ownerSplAta,
          isSigner: false,
          isWritable: true,
        },
      ])
      .signers([assetSigner])
      .rpc()

    await sleep(1000)

    const tokenAccountPost = await getAccount(
      program.provider.connection,
      ownerSplAta
    )
    console.log(tokenAccountPost.amount)

    const asset = await fetchAsset(
      umi,
      fromWeb3JsPublicKey(assetSigner.publicKey),
      {
        skipDerivePlugins: false,
      }
    )

    expect(asset.name).eq('Copper Sword')
    expect(asset.uri).eq('https://example.com/metadata.json')
    expect(asset.owner.toString()).eq(authority.publicKey.toString())
  })

  xit('crafts a fungible item', async () => {})

  // Burn Blueprint Non-Fungible Ingredient
  // Burn Blueprint Fungible Ingredient
  // ✅ Burn SPL Ingredient
  // Burn Token2022 Ingredient
  // Transfer Blueprint Non-Fungible Ingredient
  // Transfer Blueprint Fungible Ingredient
  // Transfer SPL Ingredient
  // Transfer Token2022 Ingredient
  // Multiple ingredients
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
