import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { atom } from 'jotai'

export const solBalanceAtom = atom(0)
export const solBalanceFormattedAtom = atom((get) => {
  const solBalance = get(solBalanceAtom)
  if (solBalance == null) return null
  return (solBalance / LAMPORTS_PER_SOL).toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
})
