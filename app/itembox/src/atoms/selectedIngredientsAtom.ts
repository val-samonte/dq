import { atom } from 'jotai'
import { atomFamily, atomWithStorage } from 'jotai/utils'

interface SelectedIngredient {
  id: string // blueprint or mint address
  assetType: number // Blueprint NF [0], Blueprint F [1], SPL [2], Token Extensions [3]. (1)
  amount: string // in decimal
  consumeMethod: 'retain' | 'burn' | 'transfer'
}

export const createRecipeTabAtom = atom('blueprints')
export const createRecipeSearchAtom = atom('')

// filter search
// search by id
// search by name
// search by author
// if search is valid pubkey,
// query https://tokens.jup.ag/token/So11111111111111111111111111111111111111112

const selectedIngredientsBaseAtom = atomFamily((id: string) =>
  atomWithStorage<SelectedIngredient[]>(`itembox_create_recipe_${id}`, [])
)

export enum SelectedIngredientActionTypes {
  ADD,
  UPDATE,
  REMOVE,
  CLEAR,
}

export type SelectedIngredientAction =
  | {
      type: SelectedIngredientActionTypes.ADD
      id: string
      assetType: number
      amount: string
      consumeMethod: 'retain' | 'burn' | 'transfer'
    }
  | {
      type: SelectedIngredientActionTypes.UPDATE
      id: string
      amount: string
      consumeMethod: 'retain' | 'burn' | 'transfer'
    }
  | {
      type: SelectedIngredientActionTypes.REMOVE
      id: string
    }
  | {
      type: SelectedIngredientActionTypes.CLEAR
    }

export const selectedIngredientsAtom = atomFamily((id: string) =>
  atom(
    (get) => {
      if (!id) return []
      return get(selectedIngredientsBaseAtom(id))
    },
    (get, set, action: SelectedIngredientAction) => {
      const listAtom = selectedIngredientsBaseAtom(id)
      const list = get(listAtom)

      switch (action.type) {
        case SelectedIngredientActionTypes.ADD: {
          const { type, ...payload } = action
          set(listAtom, [...list, payload])
          break
        }
        case SelectedIngredientActionTypes.UPDATE: {
          set(
            listAtom,
            list.map((i) => {
              if (i.id === action.id) {
                const { type, ...payload } = action
                return { ...i, ...payload }
              }
              return i
            })
          )
          break
        }
        case SelectedIngredientActionTypes.REMOVE: {
          set(
            listAtom,
            list.filter((i) => i.id !== action.id)
          )
          break
        }
        case SelectedIngredientActionTypes.CLEAR: {
          set(listAtom, [])
          break
        }
      }
    }
  )
)
