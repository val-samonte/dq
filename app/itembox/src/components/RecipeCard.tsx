import { BN } from '@coral-xyz/anchor'
import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useEffect, useMemo } from 'react'
import { recipeAtom } from '../atoms/recipeAtom'
import { IngredientPill, IngredientPillProps } from './IngredientPill'
import { PublicKey } from '@solana/web3.js'
import cn from 'classnames'
import { FilePlus } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

type IngredientData = IngredientPillProps & { id: string }

function Content({ id }: { id: string }) {
  const recipe = useAtomValue(recipeAtom(id))

  const { ingredients, requirements } = useMemo(() => {
    const ingredients: IngredientData[] = []
    const requirements: IngredientData[] = []

    if (recipe) {
      recipe.ingredients.forEach((ingredient) => {
        const data: IngredientData = {
          id: ingredient.asset,
          asset: new PublicKey(ingredient.asset),
          amount: new BN(ingredient.amount),
          assetType: ingredient.assetType,
          consumeMethod: ingredient.consumeMethod,
        }
        if (data.consumeMethod === 0) {
          requirements.push(data)
        } else {
          ingredients.push(data)
        }
      })
    }

    return {
      ingredients,
      requirements,
    }
  }, [recipe])

  if (!recipe) return null

  return (
    <div className='overflow-hidden rounded-lg flex flex-col gap-5 bg-gray-700 p-5'>
      <div className='flex flex-col gap-2'>
        {ingredients.length > 0 && <div className=''>Ingredients</div>}
        {ingredients.map((ingredient) => (
          <IngredientPill key={ingredient.id} {...ingredient} />
        ))}
        {requirements.length > 0 && <div className=''>Required</div>}
        {requirements.map((ingredient) => (
          <IngredientPill key={ingredient.id} {...ingredient} />
        ))}
      </div>
      <Link
        to={`/blueprints/${recipe.blueprint}/recipes/${id}`}
        className={cn(
          'w-full text-center mt-auto',
          'flex items-center justify-center gap-3',
          'rounded pr-6 pl-4 py-3 text-lg',
          'border-2 border-transparent',
          'bg-gray-600/50'
        )}
      >
        <FilePlus size={24} />
        Craft Item
      </Link>
    </div>
  )
}

export function RecipeCard({ id }: { id: string }) {
  const reload = useSetAtom(recipeAtom(id))

  useEffect(() => {
    reload()
  }, [])

  return (
    <Suspense fallback={null}>
      <Content id={id} />
    </Suspense>
  )
}
