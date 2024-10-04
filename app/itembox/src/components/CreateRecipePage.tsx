import { redirect, useParams } from 'react-router-dom'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useEffect, useState } from 'react'
import { Nav } from './Nav'
import { CenterWrapper } from './CenterWrapper'
import { useUserWallet } from '../atoms/userWalletAtom'
import cn from 'classnames'
import { CheckFat, Coins, Scroll, Shapes, Trash } from '@phosphor-icons/react'
import { allBlueprintsAtom } from '../atoms/allBlueprintsAtom'
import { SelectedIngredient } from './SelectedIngredient'
import {
  createRecipeTabAtom,
  SelectedIngredientActionTypes,
  selectedIngredientsAtom,
} from '../atoms/selectedIngredientsAtom'
import { NumberInput } from './NumberInput'
import { TokensList } from './TokensList'
import { assetSearchAtom } from '../atoms/tokensListAtom'
import { BlueprintsList } from './BlueprintsList'

function Content() {
  const wallet = useUserWallet()
  const { blueprintId } = useParams()
  const blueprint = useAtomValue(blueprintAtom(blueprintId || ''))
  const [selectedIngredients, setIngredients] = useAtom(
    selectedIngredientsAtom(blueprintId || '')
  )
  const [outputAmount, setOutputAmount] = useState('')

  const [tab, setTab] = useAtom(createRecipeTabAtom)
  const [search, setSearch] = useAtom(assetSearchAtom)

  useEffect(() => {
    if (
      !wallet?.publicKey ||
      wallet.publicKey.toBase58() !== blueprint?.authority
    ) {
      redirect(`/blueprints/${blueprintId}`)
    }
  }, [blueprint, wallet])

  if (!blueprint) {
    // todo: make skeleton
    return null
  }

  return (
    <div className='flex flex-col p-5 gap-5'>
      <div className='flex gap-5 items-center lg:py-5'>
        <div className='w-24 h-24 aspect-square rounded-lg overflow-hidden'>
          <img
            src={blueprint.image}
            className='w-full h-full object-contain '
          />
        </div>
        <h1 className='text-xl lg:text-4xl tracking-wider'>
          <span className='text-base'>New Recipe for</span>
          <br /> {blueprint.name}
        </h1>
      </div>
      <div className={cn('h-[60vh] grid grid-cols-12 gap-5')}>
        <div
          className={cn(
            'col-span-12 lg:col-span-7 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
          <div className='grid grid-cols-2 gap-2 px-2 pt-2 bg-black/20'>
            <button
              onClick={() => {
                setTab('blueprints')
              }}
              className={cn(
                tab === 'blueprints'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'rounded-t px-4 py-3 text-lg'
              )}
            >
              <Scroll size={24} />
              <span className='hidden lg:inline'>Blueprints</span>
              <span className='inline lg:hidden'>BP</span>
            </button>
            <button
              onClick={() => {
                setTab('tokens')
              }}
              className={cn(
                tab === 'tokens'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'rounded-t pr-4 lg:pr-6 pl-4 py-3 text-lg'
              )}
            >
              <Coins size={24} />
              Tokens
            </button>
          </div>
          <div className='h-full flex flex-col overflow-y-auto overflow-x-hidden relative'>
            <div className='p-3 lg:p-5 bg-gray-700 sticky top-0'>
              <input
                className={cn(
                  'z-10',
                  'items-center gap-3',
                  'rounded px-3 lg:px-6 py-3 text-lg',
                  'bg-black/20 w-full'
                )}
                type='text'
                placeholder='Search by asset address, name or symbol'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {tab === 'blueprints' && (
              <Suspense fallback={null}>
                <BlueprintsList />
              </Suspense>
            )}
            {tab === 'tokens' && (
              <Suspense fallback={null}>
                <TokensList />
              </Suspense>
            )}
          </div>
        </div>
        <div
          className={cn(
            'hidden lg:flex flex-col lg:col-span-5 h-full rounded-lg rounded-br-none bg-gray-700 overflow-hidden'
          )}
        >
          <div className='px-2 pt-2 gap-2 bg-black/20 flex items-center justify-between'>
            <div
              className={cn(
                'flex-auto',
                'bg-gray-700',
                'flex gap-3 items-center',
                'rounded-t pl-4 pr-6 py-3 text-lg'
              )}
            >
              <Shapes size={24} />
              Selected Ingredients
            </div>
            <button
              onClick={() =>
                setIngredients({ type: SelectedIngredientActionTypes.CLEAR })
              }
              className='rounded p-2 flex items-center justify-center'
            >
              <Trash size={20} />
            </button>
          </div>
          <div className='px-5 overflow-y-auto overflow-x-hidden relative flex-auto'>
            <div className='flex flex-col py-5 gap-5 show-next-when-empty'>
              {selectedIngredients.map((ing) => (
                <SelectedIngredient key={ing.id} id={ing.id} />
              ))}
            </div>
            <div className='absolute inset-0 flex items-center justify-center text-center opacity-50'>
              Please select resources from the left
            </div>
          </div>
        </div>
      </div>
      <div className='flex-none mx-auto flex items-center gap-5 portrait:flex-col lg:py-5'>
        <div className='flex flex-col lg:flex-row flex-wrap items-center justify-center gap-3'>
          <span>This Recipe will produce</span>
          {blueprint.nonFungible ? (
            <span>x1</span>
          ) : (
            <NumberInput
              min={1}
              step={1}
              decimals={0}
              className='w-full max-w-14 bg-black/10 rounded px-3 py-2 text-center'
              value={outputAmount}
              onChange={setOutputAmount}
            />
          )}
          <span>{blueprint.name}</span>
        </div>
        <button
          onClick={() => {}}
          className={cn(
            'w-fit',
            'flex items-center gap-3',
            'rounded pr-6 pl-4 py-3 text-lg',
            'bg-gradient-to-t',
            // busy ? 'opacity-50 cursor-wait' : 'opacity-100 cursor-pointer',
            'border-2 border-amber-300/50',
            'from-amber-800 to-yellow-800'
          )}
          // disabled={busy}
        >
          <CheckFat size={24} />
          Create Recipe
          {/* {state.processing && busy ? (
                <Signature size={24} />
              ) : (
                <Play size={24} />
              )}
              {state.processing
                ? busy
                  ? 'Please Sign'
                  : 'Resume Process'
                : 'Start Process'} */}
        </button>
      </div>
    </div>
  )
}

export function CreateRecipePage() {
  const { blueprintId } = useParams()
  const reloadBlueprint = useSetAtom(blueprintAtom(blueprintId || ''))
  const reloadBlueprints = useSetAtom(allBlueprintsAtom)

  useEffect(() => {
    reloadBlueprint()
    reloadBlueprints()
  }, [blueprintId])

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
