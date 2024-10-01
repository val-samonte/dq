import { atom } from 'jotai'
import { Program } from '@coral-xyz/anchor'
import { anchorProviderAtom } from './anchorProviderAtom'
import { Itembox } from '../sdk/itembox'
import QuestBoardIdl from '../sdk/itembox.json'
import { PublicKey } from '@solana/web3.js'

const questBoard = QuestBoardIdl as Itembox
export const PROGRAM_ID = new PublicKey(questBoard.address)

export const programAtom = atom((get) => {
  const provider = get(anchorProviderAtom)

  if (!provider) return null

  return new Program<Itembox>(questBoard, provider)
})
