import { atom } from 'jotai'
import { AnchorProvider } from '@coral-xyz/anchor'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import {
  Keypair,
  PublicKey,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js'
import { anchorWalletAtom } from './anchorWalletAtom'
import { connectionAtom } from './connectionAtom'
import { connectionCommitmentAtom } from './connectionCommitmentAtom'

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

export const dummyWalletAtom = atom(new KeypairWallet(Keypair.generate()))

export const anchorProviderAtom = atom((get) => {
  const wallet = get(anchorWalletAtom)

  const connection = get(connectionAtom)
  const commitment = get(connectionCommitmentAtom)
  const provider = new AnchorProvider(
    connection,
    wallet ?? get(dummyWalletAtom),
    {
      skipPreflight: true,
      commitment,
    }
  )

  return provider
})
