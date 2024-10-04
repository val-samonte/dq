import cn from 'classnames'
import { trimAddress } from '../utils/trimAddress'
import { CaretDown, CheckFat, Fire, HandDeposit } from '@phosphor-icons/react'
import { Suspense, useEffect } from 'react'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { Menu, MenuButton } from '@headlessui/react'
import { ConsumptionMethodMenuItems } from './ConsumptionMethodMenuItems'
import {
  SelectedIngredientActionTypes,
  selectedIngredientsAtom,
} from '../atoms/selectedIngredientsAtom'
import { useParams } from 'react-router-dom'
import { NumberInput } from './NumberInput'
import { PillSkeleton } from './PillSkeleton'
import { assetSearchAtom } from '../atoms/tokensListAtom'

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
      })
    } else {
      setIngredients({
        type: SelectedIngredientActionTypes.REMOVE,
        id,
      })
    }
  }

  return (
    <div
      className={cn(
        'rounded-lg',
        'border-2',
        'flex flex-col',
        selected
          ? 'border-green-400/50 bg-green-900/20'
          : 'border-transparent bg-black/10'
      )}
    >
      <div className='flex p-2 gap-5'>
        <button
          onClick={toggleSelect}
          className='flex-none rounded w-20 h-20 overflow-hidden'
        >
          <img
            src={blueprint.image}
            alt={blueprint.name}
            className='w-full h-full aspect-square object-contain'
          />
        </button>
        <div className='flex flex-col gap-1 justify-center'>
          <button className='text-left' onClick={toggleSelect}>
            {blueprint.name}
          </button>
          <div className='flex flex-wrap gap-x-3'>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-500'>ID</span>
              <span className='text-gray-400'>{trimAddress(id)}</span>
            </div>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-500'>BY</span>
              <span className='text-gray-400'>
                {trimAddress(blueprint.authority)}
              </span>
            </div>
          </div>
        </div>
      </div>
      {selected && (
        <div className='grid lg:hidden grid-cols-2 gap-2 px-2 pb-2 text-sm'>
          {blueprint.nonFungible ? (
            <div className='flex-1 bg-black/20 rounded px-2 py-1'>
              1 <span className='text-gray-400 ml-2'>(Fixed)</span>
            </div>
          ) : (
            <NumberInput
              min={1}
              step={1}
              decimals={0}
              className='flex-1 bg-black/20 rounded px-2 py-1'
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
          )}
          <Menu>
            <MenuButton
              className={cn(
                'flex-1 bg-black/20 rounded pl-1 pr-2 py-1 flex gap-2 items-center justify-center'
              )}
            >
              <span className='flex items-center gap-2'>
                {
                  {
                    retain: (
                      <>
                        <CheckFat size={20} />
                        Require <span className='hidden lg:inline'>Only</span>
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
              <CaretDown size={20} className='text-gray-600' />
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
      )}
    </div>
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
