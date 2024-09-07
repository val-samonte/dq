import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { rpcEndpointAtom } from './rpcEndpointAtom'

export interface IDBSchema extends DBSchema {
  game_accounts: {
    key: string
    value: {
      pubkey: string
      keypair: string
      last_used: number
    }
  }
}

export const idbAtom = atomFamily((id: string) =>
  atom<Promise<IDBPDatabase<IDBSchema>>>(async (get) => {
    const rpc = get(rpcEndpointAtom)
    return openDB<IDBSchema>(
      `deezquest_${rpc.includes('devnet') ? 'devnet' : 'mainnet'}_${id}`,
      1,
      {
        upgrade(db, oldVersion) {
          switch (oldVersion) {
            case 0:
            case 1: {
              db.createObjectStore('game_accounts', {
                keyPath: 'pubkey',
              })
            }
          }
        },
      }
    )
  })
)
