import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { BN } from '@coral-xyz/anchor'
import { recipeAtom } from './recipeAtom'
import { userTokenAccountAtom } from './userTokenAtom'
import { blueprintAtom } from './blueprintAtom'

interface Fungible {
  asset: string
  assetType: number
  amount: BN
  balance: BN
  consumeMethod: number
}
interface NonFungible {
  asset: string
  collection: string
  selected: string[]
}

export interface CraftingItemState {
  passed: boolean
  fungibles: Fungible[]
  nonFungibles: NonFungible[]
}

export enum CraftingItemActionType {
  ADD,
  REMOVE,
  FORCE_RELOAD,
  MAP,
}

export type CraftingItemAction =
  | {
      type: CraftingItemActionType.FORCE_RELOAD
    }
  | {
      type: CraftingItemActionType.ADD
      blueprintId: string
      assetId: string
    }
  | {
      type: CraftingItemActionType.REMOVE
      blueprintId: string
      assetId: string
    }
  | {
      type: CraftingItemActionType.MAP
      data: { blueprintId: string; collectionId: string; assetId: string }[]
    }

export const craftingItemBaseAtom = atomFamily((_: string) =>
  atom<CraftingItemState | null>(null)
)

export const craftingItemAtom = atomFamily((id: string) =>
  atom(
    (get) => {
      if (!id) return null
      return get(craftingItemBaseAtom(id))
    },
    async (get, set, action?: CraftingItemAction) => {
      if (!id) return null

      let state = get(craftingItemBaseAtom(id))

      {
        await set(recipeAtom(id))
        const recipe = await get(recipeAtom(id))

        if (!recipe) return

        const ingredients = recipe.ingredients

        const nonFungibles: NonFungible[] = []
        const fungibles: Fungible[] = []

        await Promise.all(
          ingredients.map(async (item) => {
            if (item.assetType === 0) {
              const blueprint = await get(blueprintAtom(item.asset))

              if (blueprint) {
                nonFungibles.push({
                  asset: blueprint.id,
                  collection: blueprint.mint,
                  selected: [],
                })
              }
            } else {
              const tokenAccountAtom = userTokenAccountAtom(
                `${item.asset}_${item.assetType}`
              )
              await set(tokenAccountAtom)
              const account = get(tokenAccountAtom)

              fungibles.push({
                amount: new BN(item.amount),
                asset: item.asset,
                assetType: item.assetType,
                balance: new BN(account?.amount.toString() || '0'),
                consumeMethod: item.consumeMethod,
              })
            }
          })
        )

        const passed = verifyState({
          fungibles,
          nonFungibles,
        })

        set(craftingItemBaseAtom(id), {
          fungibles,
          nonFungibles,
          passed,
        })
      }

      state = get(craftingItemBaseAtom(id))

      if (state && action) {
        let nonFungibles = [...state.nonFungibles]
        switch (action.type) {
          case CraftingItemActionType.ADD: {
            const index = nonFungibles.findIndex(
              (i) => i.asset === action.blueprintId
            )
            if (index !== -1) {
              if (!nonFungibles[index].selected.includes(action.assetId)) {
                nonFungibles[index].selected.push(action.assetId)
              }
            }
            break
          }
          case CraftingItemActionType.REMOVE: {
            const index = nonFungibles.findIndex(
              (i) => i.asset === action.blueprintId
            )
            if (index !== -1) {
              if (nonFungibles[index].selected.includes(action.assetId)) {
                nonFungibles[index].selected = nonFungibles[
                  index
                ].selected.filter((i) => i !== action.assetId)
              }
            }
            break
          }
          case CraftingItemActionType.MAP: {
            for (let i = 0; i < nonFungibles.length; i++) {
              const blueprintId = nonFungibles[i].asset
              const index = action.data.findIndex(
                (j) => j.blueprintId === blueprintId
              )
              if (index !== -1) {
                nonFungibles[i].selected = [action.data[index].assetId]
              } else {
                nonFungibles[i].selected = []
              }
            }
          }
        }

        const newState = {
          ...state,
          nonFungibles,
        }

        const passed = verifyState(newState)

        set(craftingItemBaseAtom(id), {
          ...newState,
          passed,
        })
      }
    }
  )
)

function verifyState(state: Omit<CraftingItemState, 'passed'>) {
  for (let i = 0; i < state.fungibles.length; i++) {
    const current = state.fungibles[i]

    if (current.balance.lt(current.amount)) {
      return false
    }
  }

  for (let i = 0; i < state.nonFungibles.length; i++) {
    const current = state.nonFungibles[i]

    if (current.selected.length === 0) {
      return false
    }
  }

  return true
}
