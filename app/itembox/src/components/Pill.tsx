import { X } from '@phosphor-icons/react'
import cn from 'classnames'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface PillProps {
  image?: string
  name: string
  tags: {
    label: string
    value?: string
    href?: string
    to?: string
    onClick?: () => void
  }[]
  amount?: string
  selected?: boolean
  children?: ReactNode
  onClick?: () => void
}

export function Pill({
  children,
  image,
  name,
  selected,
  tags,
  amount,
  onClick,
}: PillProps) {
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
          onClick={onClick}
          className='flex-none rounded w-20 h-20 overflow-hidden'
        >
          {image && (
            <img
              src={image}
              alt={name}
              className='w-full h-full aspect-square object-contain'
            />
          )}
        </button>
        <div className='flex-auto pr-3 flex flex-col gap-2 justify-center'>
          <button className='text-left' onClick={onClick}>
            {name}
          </button>
          <div className='flex flex-wrap gap-x-3'>
            {tags.map((tag) => {
              let content = (
                <>
                  <span className='text-gray-500'>{tag.label}</span>
                  {tag.value && (
                    <span className='text-gray-400'>{tag.value}</span>
                  )}
                </>
              )
              if (tag.href) {
                return (
                  <a
                    href={tag.href}
                    rel='noreferrer noopener'
                    target='_blank'
                    className='flex text-xs gap-2'
                  >
                    {content}
                  </a>
                )
              } else if (tag.to) {
                return (
                  <Link to={tag.to} className='flex text-xs gap-2'>
                    {content}
                  </Link>
                )
              } else if (tag.onClick) {
                return (
                  <button onClick={tag.onClick} className='flex text-xs gap-2'>
                    {content}
                  </button>
                )
              }

              return <div className='flex text-xs gap-2'>{content}</div>
            })}
          </div>
          {amount && (
            <div className='flex items-center justify-end w-full text-xs'>
              <X size={10} />
              {amount.toString()}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
