import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export interface IDBSchema extends DBSchema {
  keypairs: {
    key: string
    value: CryptoKey
  }
}

export const idbAtom = atomFamily((id: string) =>
  atom<Promise<IDBPDatabase<IDBSchema>>>(async () => {
    return openDB<IDBSchema>(`deezquest_${id}`, 1, {
      upgrade(db, oldVersion) {
        switch (oldVersion) {
          case 0:
          case 1: {
            db.createObjectStore('keypairs')
          }
        }
      },
    })
  })
)
