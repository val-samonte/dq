import { Keypair } from '@solana/web3.js'
import { atom } from 'jotai'

export const keypairAtom = atom<Keypair | null>(null)
