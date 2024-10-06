import { Suspense, useEffect, useState } from 'react'
import { Nav } from './Nav'
import { CenterWrapper } from './CenterWrapper'
import { BlueprintHeader } from './BlueprintHeader'
import cn from 'classnames'
import { useParams } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { ingredientsAtom, recipeAtom } from '../atoms/recipeAtom'
import { NumberSquareOne, Stack } from '@phosphor-icons/react'
import { IngredientExpanded } from './IngredientExpanded'
import { NonFungibleInventory } from './NonFungibleInventory'
import { useUserWallet } from '../atoms/userWalletAtom'
import { PleaseConnect } from './PleaseConnect'
import { FungibleInventory } from './FungibleInventory'

function Content() {
  const { recipeId } = useParams()
  const recipe = useAtomValue(recipeAtom(recipeId || ''))
  const { ingredients, requirements, nonFungibles, fungibles } = useAtomValue(
    ingredientsAtom(recipeId || '')
  )
  const blueprint = useAtomValue(blueprintAtom(recipe?.blueprint || ''))

  const [tab, setTab] = useState('nonfungible')

  useEffect(() => {
    setTab(nonFungibles.length > 0 ? 'nonfungible' : 'fungible')
  }, [nonFungibles])

  if (!recipe || !blueprint) {
    return null
  }

  return (
    <div className='flex flex-col p-5 gap-5'>
      <BlueprintHeader
        to={`/blueprints/${blueprint.id}`}
        name={blueprint.name}
        image={blueprint.image}
        title={'Craft new item'}
      />
      <div className={cn('lg:h-[60vh] grid grid-cols-12 gap-5')}>
        <div
          className={cn(
            'col-span-12 min-h-[25vh] max-h-[60vh] lg:col-span-6 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
          <div className='grid grid-cols-2 gap-2 px-2 pt-2 bg-black/20'>
            {nonFungibles.length > 0 && (
              <button
                onClick={() => {
                  setTab('nonfungible')
                }}
                className={cn(
                  tab === 'nonfungible'
                    ? 'opacity-100 bg-gray-700'
                    : 'opacity-80 bg-gray-700/50',
                  'flex gap-3 transition-all',
                  'items-center justify-between',
                  'rounded-t px-4 py-3 text-lg'
                )}
              >
                <span className='flex items-center gap-3 overflow-hidden text-nowrap'>
                  <NumberSquareOne size={24} className='flex-none' />
                  My Non-Fungibles
                </span>
              </button>
            )}
            <button
              onClick={() => {
                setTab('fungible')
              }}
              className={cn(
                tab === 'fungible'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'items-center justify-between',
                'rounded-t px-4 py-3 text-lg'
              )}
            >
              <span className='flex items-center gap-3 overflow-hidden text-nowrap'>
                <Stack size={24} className='flex-none' />
                My Fungibles
              </span>
            </button>
          </div>
          <div className='px-5 overflow-y-auto overflow-x-hidden relative flex-auto'>
            <div className='grid grid-cols-1 lg:grid-cols-2 py-5 gap-5 show-next-when-empty'>
              {tab === 'nonfungible' && (
                <Suspense fallback={null}>
                  <NonFungibleInventory
                    filters={nonFungibles}
                    selectMode='multiple'
                    onSelection={(_) => {
                      // console.log(items)
                    }}
                  />
                </Suspense>
              )}
              {tab === 'fungible' && (
                <FungibleInventory mint_types={fungibles} />
              )}
            </div>
            <div className='absolute inset-0 flex items-center justify-center text-center opacity-50'>
              <span className='text-center w-[80%]'>
                I do not have any related ingredients for this recipe
              </span>
            </div>
          </div>
        </div>
        <div
          className={cn(
            'col-span-12 lg:col-span-6 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
          <div className='w-full overflow-y-auto overflow-x-hidden relative'>
            <div className='flex flex-col'>
              <div className='sticky top-0 px-6 py-4 text-lg bg-black/20'>
                {blueprint.name} Ingredients
              </div>
              <div className='flex flex-col gap-5 p-5'>
                {ingredients.map((ingredient) => (
                  <IngredientExpanded key={ingredient.id} {...ingredient} />
                ))}
              </div>
              {requirements.length > 0 && (
                <>
                  <div className='sticky top-0 px-6 py-4 text-lg bg-black/20'>
                    Required Assets
                  </div>
                  <div className='flex flex-col gap-5 p-5'>
                    {requirements.map((ingredient) => (
                      <IngredientExpanded key={ingredient.id} {...ingredient} />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CraftItemPage() {
  const wallet = useUserWallet()
  const { recipeId } = useParams()
  const reload = useSetAtom(recipeAtom(recipeId || ''))

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <CenterWrapper>
        {wallet?.publicKey ? (
          <div className='min-h-[calc(100vh-4rem)]'>
            <Suspense fallback={null}>
              <Content />
            </Suspense>
          </div>
        ) : (
          <PleaseConnect />
        )}
      </CenterWrapper>
    </div>
  )
}
