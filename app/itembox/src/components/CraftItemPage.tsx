import { Suspense, useEffect, useState } from 'react'
import { Nav } from './Nav'
import { CenterWrapper } from './CenterWrapper'
import { BlueprintHeader } from './BlueprintHeader'
import cn from 'classnames'
import { useNavigate, useParams } from 'react-router-dom'
import { useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { recipeAtom } from '../atoms/recipeAtom'
import { NumberSquareOne, Stack } from '@phosphor-icons/react'

function Content() {
  const { recipeId } = useParams()
  const recipe = useAtomValue(recipeAtom(recipeId || ''))
  const blueprint = useAtomValue(blueprintAtom(recipe?.blueprint || ''))
  const navigate = useNavigate()

  const [tab, setTab] = useState('nonfungible')

  if (!recipe || !blueprint) {
    navigate('/')
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
      <div className={cn('h-[60vh] grid grid-cols-12 gap-5')}>
        <div
          className={cn(
            'col-span-12 lg:col-span-4 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
          <div className='grid grid-cols-2 gap-2 px-2 pt-2 bg-black/20'>
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
              <span className='flex items-center gap-3'>
                <NumberSquareOne size={24} />
                Non-Fungible
              </span>
            </button>
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
              <span className='flex items-center gap-3'>
                <Stack size={24} />
                Fungible
              </span>
            </button>
          </div>
        </div>
        <div
          className={cn(
            'col-span-12 lg:col-span-8 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        ></div>
      </div>
    </div>
  )
}

export function CraftItemPage() {
  const { recipeId } = useParams()
  const reload = useSetAtom(recipeAtom(recipeId || ''))

  useEffect(() => {
    reload
  }, [])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <CenterWrapper>
        <div className='min-h-[calc(100vh-4rem)]'>
          <Suspense fallback={null}>
            <Content />
          </Suspense>
        </div>
      </CenterWrapper>
    </div>
  )
}
