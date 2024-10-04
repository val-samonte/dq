import cn from 'classnames'
import { trimAddress } from '../utils/trimAddress'
import { ReactNode } from 'react'
import { explorerAddress } from '../utils/explorerAddress'

export interface TokenPillProps {
  id: string
  name: string
  image: string | null
  symbol: string
  children?: ReactNode
  onClick: () => void
}

export function TokenPill({
  id,
  name,
  image,
  symbol,
  children,
  onClick,
}: TokenPillProps) {
  return (
    <div
      className={cn(
        'rounded-lg',
        'border-2',
        'flex flex-col',
        !!children
          ? 'border-green-400/50 bg-green-900/20'
          : 'border-transparent bg-black/10'
      )}
    >
      <div className='flex p-2 gap-5'>
        <button
          onClick={onClick}
          className='flex-none rounded w-20 h-20 overflow-hidden'
        >
          {image && (
            <img
              src={image}
              alt={symbol}
              className='w-full h-full aspect-square object-contain'
            />
          )}
        </button>
        <div className='flex flex-col gap-2 justify-center'>
          <button className='text-left' onClick={onClick}>
            {name}
          </button>
          <div className='flex flex-wrap gap-x-3'>
            <a
              href={explorerAddress(id)}
              rel='noreferrer noopener'
              target='_blank'
              className='flex text-xs gap-2'
            >
              <span className='text-gray-500'>Mint</span>
              <span className='text-gray-400'>{trimAddress(id)}</span>
            </a>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-400'>{symbol}</span>
            </div>
          </div>
        </div>
      </div>
      {children}
    </div>
  )
}
