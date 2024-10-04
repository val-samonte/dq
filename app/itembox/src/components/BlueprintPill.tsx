import cn from 'classnames'
import { trimAddress } from '../utils/trimAddress'
import { CaretDown, CircleNotch, HandDeposit } from '@phosphor-icons/react'
import { Suspense, useEffect } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { Menu, MenuButton } from '@headlessui/react'
import { ConsumptionMethodMenuItems } from './ConsumptionMethodMenuItems'

function Skeleton() {
  return (
    <div
      className={cn(
        'rounded-lg bg-black/10',
        'border-2',
        'flex flex-col',
        'border-transparent'
      )}
    >
      <div className='flex p-2 gap-5'>
        <div className='flex-none rounded w-20 h-20 bg-black/20 overflow-hidden flex items-center justify-center'>
          <CircleNotch size={28} className='opacity-10 animate-spin' />
        </div>
        <div className='flex flex-col gap-1 justify-center'>
          <div className='opacity-50'>
            <div className='w-32 h-6 animate-pulse bg-white rounded' />
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
      </div>
    </div>
  )
}

function WithData({ id }: { id: string }) {
  const blueprint = useAtomValue(blueprintAtom(id))

  if (!blueprint) {
    return <Skeleton />
  }

  return (
    <div
      className={cn(
        'rounded-lg bg-black/10',
        'border-2',
        'flex flex-col',
        'border-transparent'
        // 'border-green-400/50'
      )}
    >
      <div className='flex p-2 gap-5'>
        <div className='flex-none rounded w-20 h-20 bg-black/20 overflow-hidden'>
          <img
            src={blueprint.image}
            alt={blueprint.name}
            className='w-full h-full aspect-square object-contain'
          />
        </div>
        <div className='flex flex-col gap-1 justify-center'>
          <div>{blueprint.name}</div>
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
      </div>
      <div className='grid lg:hidden grid-cols-2 gap-2 px-2 pb-2 text-sm'>
        <input
          type='number'
          min={1}
          className='flex-1 bg-black/20 rounded px-2 py-1'
          placeholder='Amount'
        />
        <Menu>
          <MenuButton
            className={cn(
              'flex-1 bg-black/20 rounded pl-1 pr-2 py-1 flex gap-2 items-center justify-center'
            )}
          >
            <span className='flex items-center gap-2'>
              <HandDeposit size={20} />
              Transfer
            </span>
            <CaretDown size={20} className='text-gray-600' />
          </MenuButton>
          <ConsumptionMethodMenuItems onSelect={console.log} />
        </Menu>
      </div>
    </div>
  )
}

export function BlueprintPill({ id }: { id: string }) {
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
