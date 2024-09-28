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
import { fetchCollection, mplCore } from '@metaplex-foundation/mpl-core'
import {
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import {
  createMint,
  getAccount,
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from '@solana/spl-token'

describe('DeezQuest: Itembox Program', () => {
  setProvider(AnchorProvider.env())

  const program = workspace.Itembox as Program<Itembox>
  const authority = loadKeypair('~/.config/solana/id.json')
  const treasuryKeypair = Keypair.generate()
  const swordBlueprint = Keypair.generate()
  const recipeSignerId = Keypair.generate()
  const token = Keypair.generate()

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
      .createBlueprint({
        mintAuthority: authority.publicKey,
        treasury: treasuryKeypair.publicKey,
        name: blueprintName,
        nonFungible: true,
        uri: 'https://example.com/metadata.json',
      })
      .accounts({
        mint: swordBlueprint.publicKey,
        owner: authority.publicKey,
      })
      .signers([swordBlueprint])
      .rpc()

    await sleep(1000)

    const blueprint = await fetchCollection(
      umi,
      fromWeb3JsPublicKey(swordBlueprint.publicKey)
    )

    expect(blueprint.name).eq(blueprintName)
    expect(blueprint.uri).eq('https://example.com/metadata.json')
  })

  xit('creates a fungible blueprint', async () => {
    // todo
  })

  it('creates a recipe', async () => {
    // todo:
    // 1. add blueprint ingredient
    // 2. add token2022 ingredient
    const ingredients = [
      {
        asset: splTokenMintIngredient,
        amount: new BN(10 * 10 ** 9),
        consumeMethod: 2,
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
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
