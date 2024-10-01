import { Wallet } from '@phosphor-icons/react'
import cn from 'classnames'

export function Nav() {
  return (
    <div className={cn('bg-slate-800 w-full h-16 sticky top-0 z-10')}>
      <div className='px-5 w-full h-full max-w-7xl mx-auto flex items-center justify-between gap-5'>
        <div className='flex-auto'>
          <input
            className={cn(
              'flex items-center gap-3',
              'rounded px-6 py-3 text-lg',
              // 'border-2 border-white/10',
              'bg-black/20 w-full'
            )}
            type='text'
            placeholder='Search by address, author or Blueprints'
          />
        </div>
        <div className='flex-none'>
          <button
            className={cn(
              'w-fit',
              'flex items-center gap-3',
              'rounded pr-4 md:pr-6 pl-4 py-3 text-lg',
              // 'border-2 border-white/10',
              'bg-gray-600/20'
            )}
          >
            <Wallet size={24} />
            <span className='hidden md:inline'>Connect Wallet</span>
          </button>
        </div>
      </div>
    </div>
  )
}
