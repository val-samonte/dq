import { atom } from 'jotai'
import { idbAtom } from './idbAtom'

export const gameAccountsAtom = atom(async (get) => {
  const idb = await get(idbAtom('root'))
  const result = await idb.getAll('game_accounts')
  return result
})
