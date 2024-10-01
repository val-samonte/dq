import { atom } from 'jotai'
import { AnchorWallet } from '@solana/wallet-adapter-react'
import { userWalletAtom } from './userWalletAtom'

export const anchorWalletAtom = atom<AnchorWallet | null>((get) => {
  const wallet = get(userWalletAtom)

  if (
    !wallet?.publicKey ||
    !wallet?.signTransaction ||
    !wallet?.signAllTransactions
  ) {
    return null
  }

  return {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  }
})
