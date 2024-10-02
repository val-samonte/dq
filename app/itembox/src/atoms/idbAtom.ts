import { DBSchema, IDBPDatabase, openDB } from 'idb'
import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { rpcEndpointAtom } from './rpcEndpointAtom'

export type BlueprintRecord = {
  id: string
  name: string
  description: string
  image: string
  uri: string
  mint: string
  nonFungible: boolean
  authority: string
  treasury: string
  mintAuthority: string
}

export type RecipeRecord = {
  id: string
  blueprint: string
  outputAmount: number
  ingredients: IngredientRecord[]
}

export type IngredientRecord = {
  asset: string
  assetType: number
  amount: number
  consumeMethod: number
}

export interface IDBSchema extends DBSchema {
  blueprints: {
    key: string
    value: BlueprintRecord
  }
  recipes: {
    key: string
    value: RecipeRecord
  }
}

export const idbAtom = atomFamily((id: string) =>
  atom<Promise<IDBPDatabase<IDBSchema>>>(async (get) => {
    const rpc = get(rpcEndpointAtom)
    return openDB<IDBSchema>(
      `itembox_${
        rpc.toLowerCase().includes('devnet') ? 'devnet' : 'mainnet'
      }_${id}`,
      1,
      {
        upgrade(db, oldVersion) {
          switch (oldVersion) {
            case 0:
            case 1: {
              db.createObjectStore('blueprints', {
                keyPath: 'pubkey',
              })
              db.createObjectStore('recipes', {
                keyPath: 'pubkey',
              })
            }
          }
        },
      }
    )
  })
)
