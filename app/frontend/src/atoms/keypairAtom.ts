import { Keypair } from '@solana/web3.js'
import { atom } from 'jotai'
import { trimAddress } from '../utils/trimAddress'

export const keypairAtom = atom<Keypair | null>(null)
export const pubkeyAtom = atom((get) => {
  const kp = get(keypairAtom)
  if (!kp) return null

  return kp.publicKey.toBase58()
})
export const trimmedPubkeyAtom = atom((get) => {
  const pubkey = get(pubkeyAtom)
  if (!pubkey) return null
  return trimAddress(pubkey)
})
