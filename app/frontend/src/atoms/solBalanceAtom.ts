import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { atom } from 'jotai'

export const solBalanceInLamportAtom = atom(0)
export const solBalanceAtom = atom((get) => {
  const solBalanceInLamport = get(solBalanceInLamportAtom)
  if (solBalanceInLamport == null) return null
  return (solBalanceInLamport ?? 0) / LAMPORTS_PER_SOL
})
export const solBalanceFormattedAtom = atom((get) => {
  const solBalance = get(solBalanceAtom)
  if (solBalance == null) return null
  return solBalance.toLocaleString('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })
})
