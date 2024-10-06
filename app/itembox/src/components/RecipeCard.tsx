import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useEffect } from 'react'
import { ingredientsAtom, recipeAtom } from '../atoms/recipeAtom'
import { IngredientPill } from './IngredientPill'
import cn from 'classnames'
import { FilePlus, X } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

function Content({ id }: { id: string }) {
  const recipe = useAtomValue(recipeAtom(id))
  const { ingredients, requirements } = useAtomValue(ingredientsAtom(id))

  if (!recipe) return null

  return (
    <div className='overflow-hidden rounded-lg flex flex-col gap-5 bg-gray-700 p-5'>
      <div className='text-lg flex items-center gap-3'>
        Produces{' '}
        <span className='flex items-center'>
          <X size={14} />
          {recipe.outputAmount}
        </span>
      </div>
      <div className='flex flex-col gap-2'>
        {ingredients.length > 0 && (
          <div className='text-gray-400'>Ingredients</div>
        )}
        {ingredients.map((ingredient) => (
          <IngredientPill key={ingredient.id} {...ingredient} />
        ))}
        {requirements.length > 0 && (
          <div className='text-gray-400'>Required</div>
        )}
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
