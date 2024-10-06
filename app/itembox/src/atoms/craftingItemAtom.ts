import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { BN } from '@coral-xyz/anchor'
import { recipeAtom } from './recipeAtom'
import { userTokenAccountAtom } from './userTokenAtom'

interface Fungible {
  asset: string
  assetType: number
  amount: BN
  balance: BN
  consumeMethod: number
}
interface NonFungible {
  asset: string
  selected: string[]
}

export interface CraftingItemState {
  passed: false
  fungible: Fungible[]
  nonFungible: NonFungible[]
}

const defaultCraftingItemState: CraftingItemState = {
  fungible: [],
  nonFungible: [],
  passed: false,
}

export enum CraftingItemActionType {
  ADD,
  REMOVE,
  FORCE_RELOAD,
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

export const craftingItemBaseAtom = atomFamily((_: string) => atom(null))

export const craftingItemAtom = atomFamily((id: string) =>
  atom(
    (get) => {
      if (!id) return null
      return get(craftingItemBaseAtom(id))
    },
    async (get, set, action?: CraftingItemAction) => {
      if (!id) return null

      const state = get(craftingItemBaseAtom(id))

      if (
        (!action && !state) ||
        action?.type === CraftingItemActionType.FORCE_RELOAD
      ) {
        await set(recipeAtom(id))
        const recipe = await get(recipeAtom(id))

        if (!recipe) return

        const ingredients = recipe.ingredients

        const nonFungibles: NonFungible[] = []
        const fungibles: Fungible[] = []

        await Promise.all(
          ingredients.map(async (item) => {
            if (item.assetType === 0) {
              nonFungibles.push({
                asset: item.asset,
                selected: [],
              })
            } else {
              const tokenAccountAtom = userTokenAccountAtom(
                `${item.asset}_${item.assetType}`
              )
              await set(tokenAccountAtom, true)
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
      } else if (action) {
        switch (action.type) {
          case CraftingItemActionType.ADD: {
            break
          }
          case CraftingItemActionType.REMOVE: {
            break
          }
        }

        // check if passed
      }
    }
  )
)

function verifyState(state: CraftingItemState) {
  // ensure all fungibles have sufficient balance
  // ensure all nonfungibles have selected items
}
