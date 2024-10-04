import {
  CaretDown,
  CheckFat,
  CircleNotch,
  Fire,
  HandDeposit,
  TrashSimple,
} from '@phosphor-icons/react'
import { trimAddress } from '../utils/trimAddress'
import { Menu, MenuButton } from '@headlessui/react'
import cn from 'classnames'
import { ConsumptionMethodMenuItems } from './ConsumptionMethodMenuItems'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { Suspense, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  SelectedIngredientActionTypes,
  selectedIngredientsAtom,
} from '../atoms/selectedIngredientsAtom'
import { NumberInput } from './NumberInput'

function Skeleton() {
  return (
    <div className='bg-black/10 rounded-lg p-3 flex gap-3'>
      <div className='flex-none rounded w-24 h-24 bg-black/20 overflow-hidden flex items-center justify-center'>
        <CircleNotch size={32} className='opacity-10 animate-spin' />
      </div>
      <div className='flex flex-col flex-auto gap-2'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between opacity-50'>
            <div className='w-40 h-5 my-1 bg-white rounded animate-pulse' />
          </div>
          <div className='flex flex-wrap gap-x-3'>
            <div className='flex text-xs gap-2 opacity-50'>
              <div className='w-4 h-4 animate-pulse bg-gray-600 rounded' />
              <div className='w-16 h-4 animate-pulse bg-gray-400 rounded' />
            </div>
            <div className='flex text-xs gap-2 opacity-50'>
              <div className='w-4 h-4 animate-pulse bg-gray-600 rounded' />
              <div className='w-16 h-4 animate-pulse bg-gray-400 rounded' />
            </div>
          </div>
        </div>
        <div className='flex gap-3 mt-auto'>
          <div className='flex-auto w-full h-10 bg-black/10 rounded px-3 py-2 animate-pulse' />
          <div
            className={cn(
              'flex-none w-40 h-10 bg-black/10 rounded px-3 py-2',
              'flex items-center gap-2 justify-between',
              'animate-pulse'
            )}
          />
        </div>
      </div>
    </div>
  )
}

function WithData({ id }: { id: string }) {
  const blueprint = useAtomValue(blueprintAtom(id))
  const { blueprintId } = useParams()
  const [selectedIngredients, setIngredients] = useAtom(
    selectedIngredientsAtom(blueprintId || '')
  )

  const selected = selectedIngredients.find((i) => i.id === id)

  if (!selected) return null

  if (!blueprint) {
    return <Skeleton />
  }

  return (
    <div className='bg-black/10 rounded-lg p-3 flex gap-3'>
      <div className='flex-none rounded w-24 h-24 bg-black/20 overflow-hidden'>
        <img
          src={blueprint.image}
          alt={blueprint.name}
          className='w-full h-full aspect-square object-contain'
        />
      </div>
      <div className='flex flex-col flex-auto gap-2'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between'>
            <span className='text-lg'>{blueprint.name}</span>
            <button
              onClick={() => {
                setIngredients({
                  type: SelectedIngredientActionTypes.REMOVE,
                  id,
                })
              }}
            >
              <TrashSimple size={16} />
            </button>
          </div>
          <div className='flex flex-wrap gap-x-3'>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-600'>ID</span>
              <span className='text-gray-400'>{trimAddress(id)}</span>
            </div>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-600'>BY</span>
              <span className='text-gray-400'>
                {trimAddress(blueprint.authority)}
              </span>
            </div>
          </div>
        </div>
        <div className='flex gap-3 mt-auto'>
          <NumberInput
            min={1}
            step={1}
            decimals={0}
            className='flex-auto w-full bg-black/10 rounded px-3 py-2'
            placeholder='Amount'
            value={selected.amount}
            onChange={(e) => {
              setIngredients({
                ...selected,
                type: SelectedIngredientActionTypes.UPDATE,
                amount: e,
              })
            }}
          />
          <Menu>
            <MenuButton
              className={cn(
                'flex-none w-40 bg-black/10 rounded px-3 py-2',
                'flex items-center gap-2 justify-between'
              )}
            >
              <span className='flex items-center gap-2'>
                {
                  {
                    retain: (
                      <>
                        <CheckFat size={20} />
                        Require
                      </>
                    ),
                    burn: (
                      <>
                        <Fire size={20} />
                        Burn
                      </>
                    ),
                    transfer: (
                      <>
                        <HandDeposit size={20} />
                        Transfer
                      </>
                    ),
                  }[selected.consumeMethod]
                }
              </span>
              <CaretDown size={20} className='opacity-20' />
            </MenuButton>
            <ConsumptionMethodMenuItems
              onSelect={(consumeMethod) => {
                setIngredients({
                  ...selected,
                  type: SelectedIngredientActionTypes.UPDATE,
                  consumeMethod,
                })
              }}
            />
          </Menu>
        </div>
      </div>
    </div>
  )
}

export function SelectedIngredient({ id }: { id: string }) {
  const reload = useSetAtom(blueprintAtom(id))

  useEffect(() => {
    reload()
  }, [id])

  return (
    <Suspense fallback={<Skeleton />}>
      <WithData id={id} />
    </Suspense>
  )
}
