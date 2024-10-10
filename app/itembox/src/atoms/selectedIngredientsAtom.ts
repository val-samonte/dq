import { atom } from 'jotai'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { TokenItem } from './tokensListAtom'

interface SelectedIngredient extends Omit<TokenItem, 'symbol'> {
  id: string // blueprint or mint address
  assetType: number // Blueprint NF [0], Blueprint F [1], SPL [2], Token Extensions [3]. (1)
  amount: string // in decimal
  consumeMethod: 'retain' | 'burn' | 'transfer'
  authority?: string
}

export const createRecipeTabAtom = atom('blueprints')

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
      name: string
      image: string
      decimals: number
      authority?: string
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
          if (list.length < 9) {
            set(listAtom, [...list, payload])
          }
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

export const selectedIngredientsCounterAtom = atomFamily((id: string) =>
  atom((get) => {
    const list = get(selectedIngredientsAtom(id))

    let blueprints = 0
    let tokens = 0

    for (let i = 0; i < list.length; i++) {
      if (list[i].assetType === 3) {
        tokens++
      } else {
        blueprints++
      }
    }

    return {
      total: blueprints + tokens,
      blueprints,
      tokens,
    }
  })
)
