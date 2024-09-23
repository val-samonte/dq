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

describe('DeezQuest: Itembox Program', () => {
  setProvider(AnchorProvider.env())

  const program = workspace.Itembox as Program<Itembox>
  const authority = loadKeypair('~/.config/solana/id.json')
  const treasuryKeypair = Keypair.generate()
  const collection = Keypair.generate()
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

  console.log('Itembox Program ID', program.programId.toBase58())
  console.log('Itembox Main Pda', mainPda.toBase58())
  console.log('Blueprint Collection ID', collection.publicKey.toBase58())

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
        blueprintMintFee: new BN(0.0002 * LAMPORTS_PER_SOL),
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

  it('creates a non-fungible blueprint', async () => {
    await program.methods
      .createBlueprint({
        mintAuthority: authority.publicKey,
        treasury: treasuryKeypair.publicKey,
        name: 'Non-Fungible Blueprint',
        nonFungible: true,
        uri: 'https://example.com/metadata.json',
      })
      .accounts({
        asset: collection.publicKey,
        owner: authority.publicKey,
      })
      .signers([collection])
      .rpc()

    await sleep(1000)

    const collectionData = await fetchCollection(
      umi,
      fromWeb3JsPublicKey(collection.publicKey)
    )

    expect(collectionData.name).eq('Non-Fungible Blueprint')
    expect(collectionData.uri).eq('https://example.com/metadata.json')
  })
})

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
