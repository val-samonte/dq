import { AnchorProvider, BN, Program } from '@coral-xyz/anchor'
import { Itembox } from '../target/types/itembox'
import idl from '../target/idl/itembox.json'
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Connection,
  Transaction,
  VersionedTransaction,
  Keypair,
} from '@solana/web3.js'
import { loadKeypair } from './utils'

export interface AnchorWallet {
  publicKey: PublicKey
  signTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T
  ): Promise<T>
  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[]
  ): Promise<T[]>
}

export class KeypairWallet implements AnchorWallet {
  constructor(readonly payer: Keypair) {}

  async signTransaction<T extends Transaction | VersionedTransaction>(
    tx: T
  ): Promise<T> {
    if (tx instanceof Transaction) {
      tx.partialSign(this.payer)
    }

    return tx
  }

  async signAllTransactions<T extends Transaction | VersionedTransaction>(
    txs: T[]
  ): Promise<T[]> {
    return txs.map((tx) => {
      if (tx instanceof Transaction) {
        tx.partialSign(this.payer)
      }
      return tx
    })
  }

  get publicKey(): PublicKey {
    return this.payer.publicKey
  }
}

const main = async () => {
  const authority = loadKeypair('~/.config/solana/id.json')
  const wallet = new KeypairWallet(authority)
  const provider = new AnchorProvider(
    new Connection(
      'https://devnet.helius-rpc.com/?api-key=8e1061ca-764a-4435-a567-bba9405cc1c2',
      'confirmed'
    ),
    wallet,
    {
      skipPreflight: true,
      commitment: 'confirmed',
    }
  )

  const itemBoxIdl = idl as Itembox
  const program = new Program<Itembox>(itemBoxIdl, provider)

  const [mainPda] = PublicKey.findProgramAddressSync(
    [Buffer.from('main')],
    program.programId
  )

  console.log(mainPda.toBase58())

  try {
    await program.methods
      .init({
        blueprintMintFee: new BN(0.0002 * LAMPORTS_PER_SOL),
        tokenMint: new PublicKey(
          'DQTNP5FBEcCsEkdPH5JQfAjJAyAavbCHfhk2T5YAUj4L'
        ),
        treasury: authority.publicKey,
      })
      .accounts({
        authority: authority.publicKey,
      })
      .rpc()
  } catch (e) {
    console.error(e)
  }
}

main()
