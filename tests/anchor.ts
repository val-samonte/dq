// create main
// create character

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

describe('DeezQuest: Trinexus Program', () => {
  setProvider(AnchorProvider.env())

  const program = workspace.Dq as Program<Dq>
  const authority = loadKeypair('~/.config/solana/id.json')
  const treasuryKeypair = Keypair.generate()
  const characterAsset = Keypair.generate()
  const token = Keypair.generate()

  const [mainPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('main')],
    program.programId
  )

  console.log('Program ID', program.programId.toBase58())

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
})
