import { CircleNotch } from '@phosphor-icons/react'
import cn from 'classnames'

export function PillSkeleton() {
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
        <div className='flex flex-col gap-2 justify-center'>
          <div className='opacity-50'>
            <div className='w-32 h-6 animate-pulse bg-white rounded' />
          </div>
          <div className='flex flex-wrap gap-x-3 gap-y-1'>
            <div className='flex text-xs gap-2 opacity-50'>
              <div className='w-4 h-4 animate-pulse bg-gray-500 rounded' />
              <div className='w-16 h-4 animate-pulse bg-gray-400 rounded' />
            </div>
            <div className='flex text-xs gap-2 opacity-50'>
              <div className='w-4 h-4 animate-pulse bg-gray-500 rounded' />
              <div className='w-16 h-4 animate-pulse bg-gray-400 rounded' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
