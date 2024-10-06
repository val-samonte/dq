import cn from 'classnames'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export interface PillExpandedProps {
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

export function PillExpanded({
  image,
  name,
  selected,
  tags,
  amount,
  onClick,
}: PillExpandedProps) {
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
          <div className='flex items-center justify-between gap-2 flex-wrap'>
            <button className='text-left lg:text-lg' onClick={onClick}>
              {name}
            </button>
            <div className='flex flex-wrap gap-x-3'>
              {tags.map((tag) => {
                let content = (
                  <>
                    <span className='text-gray-500 text-xs lg:text-sm'>
                      {tag.label}
                    </span>
                    {tag.value && (
                      <span className='text-gray-400 text-xs lg:text-sm'>
                        {tag.value}
                      </span>
                    )}
                  </>
                )
                if (tag.href) {
                  return (
                    <a
                      key={tag.label}
                      href={tag.href}
                      rel='noreferrer noopener'
                      target='_blank'
                      className='flex text-xs lg:text-sm gap-2'
                    >
                      {content}
                    </a>
                  )
                } else if (tag.to) {
                  return (
                    <Link
                      key={tag.label}
                      to={tag.to}
                      className='flex text-xs  lg:text-sm gap-2'
                    >
                      {content}
                    </Link>
                  )
                } else if (tag.onClick) {
                  return (
                    <button
                      key={tag.label}
                      onClick={tag.onClick}
                      className='flex text-xs  lg:text-sm gap-2'
                    >
                      {content}
                    </button>
                  )
                }

                return (
                  <div key={tag.label} className='flex text-sm gap-2'>
                    {content}
                  </div>
                )
              })}
            </div>
          </div>
          {amount && (
            <div className='flex items-center justify-end w-full flex-wrap'>
              <span>{amount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
