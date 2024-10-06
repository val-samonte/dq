import {
  CaretDown,
  CheckFat,
  Fire,
  HandDeposit,
  TrashSimple,
} from '@phosphor-icons/react'
import { trimAddress } from '../utils/trimAddress'
import { Menu, MenuButton } from '@headlessui/react'
import cn from 'classnames'
import { ConsumptionMethodMenuItems } from './ConsumptionMethodMenuItems'
import { useAtom } from 'jotai'
import { useParams } from 'react-router-dom'
import {
  SelectedIngredientActionTypes,
  selectedIngredientsAtom,
} from '../atoms/selectedIngredientsAtom'
import { NumberInput } from './NumberInput'

export function SelectedIngredient({ id }: { id: string }) {
  const { blueprintId } = useParams()
  const [selectedIngredients, setIngredients] = useAtom(
    selectedIngredientsAtom(blueprintId || '')
  )
  const selected = selectedIngredients.find((i) => i.id === id)

  if (!selected) return null

  return (
    <div className='bg-black/10 rounded-lg p-3 flex gap-3'>
      <div className='flex-none rounded w-24 h-24 overflow-hidden'>
        <img
          src={selected.image}
          alt={selected.name}
          className='w-full h-full aspect-square object-contain'
        />
      </div>
      <div className='flex flex-col flex-auto gap-2'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between'>
            <span className='text-lg'>{selected.name}</span>
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
              <span className='text-gray-500'>ID</span>
              <span className='text-gray-400'>{trimAddress(id)}</span>
            </div>
            {selected.authority && (
              <div className='flex text-xs gap-2'>
                <span className='text-gray-500'>BY</span>
                <span className='text-gray-400'>
                  {trimAddress(selected.authority)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className='flex gap-3 mt-auto'>
          {selected.assetType === 0 ? (
            <div className='flex-auto w-full bg-black/10 rounded px-3 py-2'>
              1 <span className='text-gray-400 ml-2'>(Fixed)</span>
            </div>
          ) : (
            <NumberInput
              decimals={selected.assetType === 1 ? 0 : selected.decimals}
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
          )}
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
