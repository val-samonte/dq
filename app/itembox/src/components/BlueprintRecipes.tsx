import { useAtomValue, useSetAtom } from 'jotai'
import { BlueprintRecord } from '../atoms/idbAtom'
import { PageHeader } from './PageHeader'
import { recipesAtom } from '../atoms/recipesAtom'
import { Suspense, useEffect } from 'react'
import { RecipeCard } from './RecipeCard'

function Content(blueprint: BlueprintRecord) {
  const recipes = useAtomValue(recipesAtom(blueprint.id))

  if (recipes.length === 0) {
    // todo: provide info no recipes
    return null
  }

  return (
    <>
      <PageHeader>{blueprint.name} Recipes</PageHeader>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 px-5'>
        {recipes.map((id) => (
          <RecipeCard key={id} id={id} />
        ))}
      </div>
    </>
  )
}

export function BlueprintRecipes(blueprint: BlueprintRecord) {
  const reload = useSetAtom(recipesAtom(blueprint.id))

  useEffect(() => {
    reload()
  }, [])

  return (
    <Suspense fallback={null}>
      <Content {...blueprint} />
    </Suspense>
  )
}
