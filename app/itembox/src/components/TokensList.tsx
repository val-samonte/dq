import { useAtom, useAtomValue } from 'jotai'
import { TokenPill, TokenPillProps } from './TokenPill'
import { queriedTokenAtom, tokensListAtom } from '../atoms/tokensListAtom'
import { Suspense } from 'react'
import { PillSkeleton } from './PillSkeleton'
import { useParams } from 'react-router-dom'
import {
  SelectedIngredientActionTypes,
  selectedIngredientsAtom,
} from '../atoms/selectedIngredientsAtom'
import { PillSelected } from './PillSelected'

function TokenPillWrapper(
  token: Omit<TokenPillProps, 'onClick'> & { decimals: number }
) {
  const { blueprintId } = useParams()
  const [selectedIngredients, setIngredients] = useAtom(
    selectedIngredientsAtom(blueprintId || '')
  )
  const selected = selectedIngredients.find((i) => i.id === token.id)

  return (
    <TokenPill
      key={token.id}
      {...token}
      onClick={() => {
        if (!selected) {
          setIngredients({
            type: SelectedIngredientActionTypes.ADD,
            id: token.id,
            amount: '1',
            assetType: 3,
            consumeMethod: 'transfer',
            name: token.name,
            image: token.image || '',
            decimals: token.decimals,
          })
        } else {
          setIngredients({
            type: SelectedIngredientActionTypes.REMOVE,
            id: token.id,
          })
        }
      }}
    >
      {selected && (
        <PillSelected
          amount={selected.amount}
          consumeMethod={selected.consumeMethod}
          decimals={token.decimals}
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
    </TokenPill>
  )
}

function QueriedToken() {
  const token = useAtomValue(queriedTokenAtom)

  if (!token) {
    return null
  }

  return <TokenPillWrapper key={token.id} {...token} />
}

export function TokensList() {
  const tokens = useAtomValue(tokensListAtom)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5 px-3 lg:px-5 pb-3 lg:pb-5'>
      {tokens.map((token) => (
        <TokenPillWrapper key={token.id} {...token} />
      ))}
      <Suspense fallback={<PillSkeleton />}>
        <QueriedToken />
      </Suspense>
    </div>
  )
}
