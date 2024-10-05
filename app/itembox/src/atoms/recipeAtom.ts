import { IdlAccounts } from '@coral-xyz/anchor'
import { Itembox } from '../sdk/itembox'
import { atom } from 'jotai'
import { programAtom } from './programAtom'
import { BatchCallback } from '../utils/BatchCallback'
import { atomFamily } from 'jotai/utils'
import { idbAtom, RecipeRecord } from './idbAtom'

type BatchResult = {
  account: IdlAccounts<Itembox>['recipe']
  publicKey: string
}[]

const batchFetcherAtom = atom((get) => {
  const program = get(programAtom)

  return new BatchCallback<BatchResult>(async (addresses) => {
    const result = await program.account.recipe.fetchMultiple(addresses)
    return result.map((account, i) => ({
      account,
      publicKey: addresses[i],
    })) as BatchResult
  })
})

const refresher = atomFamily((_: string) => atom(Date.now()))

export const recipeAtom = atomFamily((id: string) =>
  atom(
    async (get) => {
      if (!id) return null

      get(refresher(id))
      const idb = await get(idbAtom('records'))

      if (!idb) return null

      // todo: should we use unresolved promise?
      return (await idb.get('recipes', id)) || null
    },
    async (get, set, force = false) => {
      const idb = await get(idbAtom('records'))
      if (!idb) return

      if (!force) {
        const record = await idb.get('recipes', id)
        // return if cached, unless forced
        if (record) return
      }

      const fetcher = get(batchFetcherAtom)

      const batchAddresses = await fetcher.add(id)
      const result = batchAddresses.find(({ publicKey }) => publicKey === id)

      if (!result?.account) return
      const data = result.account

      const recipe: RecipeRecord = {
        id,
        blueprint: data.blueprint.toBase58(),
        outputAmount: data.outputAmount.toString(),
        ingredients: data.ingredients.map((ingredient) => ({
          amount: ingredient.amount.toString(),
          asset: ingredient.asset.toBase58(),
          assetType: ingredient.assetType,
          consumeMethod: ingredient.consumeMethod,
        })),
      }

      await idb.put('recipes', recipe)

      set(refresher(id), Date.now())
    }
  )
)
