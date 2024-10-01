import { atom } from 'jotai'
import { Commitment } from '@solana/web3.js'

export const connectionCommitmentAtom = atom<Commitment>('confirmed')
