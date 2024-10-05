import { trimAddress } from '../utils/trimAddress'
import { Suspense, useEffect } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import {
  SelectedIngredientActionTypes,
  selectedIngredientsAtom,
} from '../atoms/selectedIngredientsAtom'
import { useParams } from 'react-router-dom'
import { PillSkeleton } from './PillSkeleton'
import { assetSearchAtom } from '../atoms/tokensListAtom'
import { Pill } from './Pill'
import { PillSelected } from './PillSelected'

function WithData({ id }: { id: string }) {
  const search = useAtomValue(assetSearchAtom)
  const blueprint = useAtomValue(blueprintAtom(id))
  const { blueprintId } = useParams()
  const [selectedIngredients, setIngredients] = useAtom(
    selectedIngredientsAtom(blueprintId || '')
  )

  const selected = selectedIngredients.find((i) => i.id === id)

  if (!blueprint) {
    return null
  }

  if (search) {
    if (
      !(
        blueprint.id === search.trim() ||
        blueprint.authority === search.trim() ||
        blueprint.mint === search.trim() ||
        blueprint.name.toLowerCase().includes(search.trim().toLowerCase())
      )
    ) {
      return null
    }
  }

  const toggleSelect = () => {
    if (!selected) {
      setIngredients({
        type: SelectedIngredientActionTypes.ADD,
        id,
        amount: '1',
        assetType: blueprint.nonFungible ? 0 : 1,
        consumeMethod: 'transfer',
        name: blueprint.name,
        image: blueprint.image,
        authority: blueprint.authority,
        decimals: 0,
      })
    } else {
      setIngredients({
        type: SelectedIngredientActionTypes.REMOVE,
        id,
      })
    }
  }

  return (
    <Pill
      name={blueprint.name}
      image={blueprint.image ?? undefined}
      onClick={toggleSelect}
      selected={!!selected}
      tags={[
        {
          label: 'ID',
          value: trimAddress(id),
          to: `/blueprints/${id}`,
        },
        {
          label: 'BY',
          value: trimAddress(blueprint.authority),
          to: `/user/${blueprint.authority}`,
        },
      ]}
    >
      {selected && (
        <PillSelected
          nonFungible={blueprint.nonFungible}
          amount={selected.amount}
          consumeMethod={selected.consumeMethod}
          decimals={0}
          onAmountChange={(amount) => {
            setIngredients({
              ...selected,
              type: SelectedIngredientActionTypes.UPDATE,
              amount,
            })
          }}
          onConsumeMethodChange={(consumeMethod) => {
            setIngredients({
              ...selected,
              type: SelectedIngredientActionTypes.UPDATE,
              consumeMethod,
            })
          }}
        />
      )}
    </Pill>
  )
}

export function BlueprintPill({ id }: { id: string }) {
  const reload = useSetAtom(blueprintAtom(id))

  useEffect(() => {
    reload()
  }, [id])

  return (
    <Suspense fallback={<PillSkeleton />}>
      <WithData id={id} />
    </Suspense>
  )
}
