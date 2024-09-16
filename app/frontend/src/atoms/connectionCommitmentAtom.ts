import { atom } from 'jotai'
import { Commitment } from '@metaplex-foundation/umi'

export const connectionCommitmentAtom = atom<Commitment>('confirmed')
