import { CaretDown, HandDeposit, TrashSimple } from '@phosphor-icons/react'
import { trimAddress } from '../utils/trimAddress'
import { Menu, MenuButton } from '@headlessui/react'
import cn from 'classnames'
import { ConsumptionMethodMenuItems } from './ConsumptionMethodMenuItems'

function Skeleton() {
  return (
    <div className='bg-black/10 rounded-lg p-3 flex gap-3'>
      <div className='flex-none rounded w-24 h-24 bg-black/20 overflow-hidden'></div>
      <div className='flex flex-col flex-auto gap-2'>
        <div className='flex flex-col gap-1'>
          <div className='flex justify-between'>
            <span className='text-lg'>Copper Sword</span>
            <button>
              <TrashSimple size={16} />
            </button>
          </div>
          <div className='flex flex-wrap gap-x-3'>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-600'>ID</span>
              <span className='text-gray-400'>
                {trimAddress('53vUyd7iFntjgcwtmAZAhtyrWmssiRvs3AvWiUJfoXw5')}
              </span>
            </div>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-600'>BY</span>
              <span className='text-gray-400'>
                {trimAddress('53vUyd7iFntjgcwtmAZAhtyrWmssiRvs3AvWiUJfoXw5')}
              </span>
            </div>
          </div>
        </div>
        <div className='flex gap-3 mt-auto'>
          <input
            type='number'
            min={1}
            className='flex-auto w-full bg-black/10 rounded px-3 py-2'
            placeholder='Amount'
          />
          <Menu>
            <MenuButton
              className={cn(
                'flex-none w-40 bg-black/10 rounded px-3 py-2',
                'flex items-center gap-2 justify-between'
              )}
            >
              <span className='flex items-center gap-2'>
                <HandDeposit size={20} />
                Transfer
              </span>
              <CaretDown size={20} className='opacity-20' />
            </MenuButton>
            <ConsumptionMethodMenuItems onSelect={console.log} />
          </Menu>
        </div>
      </div>
    </div>
  )
}

export function SelectedIngredient() {
  return <Skeleton />
}
