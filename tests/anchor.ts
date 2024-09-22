import {
  AnchorProvider,
  BN,
  Program,
  setProvider,
  workspace,
} from '@coral-xyz/anchor'
import { Dq } from '../target/types/dq'
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
import { fetchAssetsByOwner, mplCore } from '@metaplex-foundation/mpl-core'
import {
  signerIdentity,
  createSignerFromKeypair,
} from '@metaplex-foundation/umi'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'

describe('DeezQuest: Trinexus Program', () => {
  setProvider(AnchorProvider.env())

  const program = workspace.Dq as Program<Dq>
  const authority = loadKeypair('~/.config/solana/id.json')
  const treasuryKeypair = Keypair.generate()
  const characterAsset = Keypair.generate()
  const token = Keypair.generate()

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

  const [characterPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('character'), characterAsset.publicKey.toBytes()],
    program.programId
  )

  console.log('Program ID', program.programId.toBase58())
  console.log('Character Asset', characterAsset.publicKey.toBase58())

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
  })

  it('initialize main', async () => {
    await program.methods
      .init({
        characterMintFee: new BN(0.0002 * LAMPORTS_PER_SOL),
        tokenMint: token.publicKey,
        treasury: treasuryKeypair.publicKey,
      })
      .accounts({
        authority: authority.publicKey,
      })
      .rpc()

    const main = await program.account.main.fetch(mainPda)

    expect(main.authority.equals(program.provider.publicKey)).to.be.true
  })

  it('mints a character', async () => {
    await program.methods
      .createCharacter({
        name: 'Shivani',
        gender: 'female',
        statInt: 3,
        statStr: 3,
        statDex: 3,
        statVit: 3,
      })
      .accounts({
        asset: characterAsset.publicKey,
        owner: authority.publicKey,
      })
      .signers([characterAsset])
      .rpc()

    const character = await program.account.character.fetch(characterPda)

    expect(character.gender).eq(1)
    expect(character.statInt).eq(3)
    expect(character.statStr).eq(3)
    expect(character.statDex).eq(3)
    expect(character.statVit).eq(3)

    const characters = await fetchAssetsByOwner(
      umi,
      fromWeb3JsPublicKey(authority.publicKey)
    )

    expect(characters[0].publicKey.toString()).eq(
      characterAsset.publicKey.toBase58()
    )
    expect(characters[0].owner.toString()).eq(authority.publicKey.toBase58())
  })
})
