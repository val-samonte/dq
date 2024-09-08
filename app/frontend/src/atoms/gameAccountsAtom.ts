import { atom } from 'jotai'
import { GameAccount, idbAtom } from './idbAtom'

export enum GameAccountActionType {
  NEW,
  UPDATE,
}

export type GameAccountAction =
  | {
      type: GameAccountActionType.NEW
      payload: GameAccount
    }
  | {
      type: GameAccountActionType.UPDATE
      payload: Partial<Omit<GameAccount, 'pubkey'>> & { pubkey: string }
    }

const refresher = atom(0)

export const gameAccountsAtom = atom(
  async (get) => {
    get(refresher)
    const idb = await get(idbAtom('root'))
    const result = await idb.getAll('game_accounts')
    return result
  },
  async (get, set, action: GameAccountAction) => {
    const idb = await get(idbAtom('root'))
    switch (action.type) {
      case GameAccountActionType.NEW: {
        await idb.put('game_accounts', action.payload)
        break
      }
      case GameAccountActionType.UPDATE: {
        const prev = await idb.get('game_accounts', action.payload.pubkey)
        if (prev) {
          await idb.put('game_accounts', { ...prev, ...action.payload })
        }
        break
      }
    }
    set(refresher, Date.now())
  }
)
