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
  href?: string
}

function Clickable({
  children,
  className,
  href,
  onClick,
}: {
  children: ReactNode
  className?: string
  href?: string
  onClick?: () => void
}) {
  if (href) {
    return (
      <a
        className={className}
        href={href}
        target={'_blank'}
        rel={'noreferrer noopener'}
      >
        {children}
      </a>
    )
  }

  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export function Pill({
  children,
  image,
  name,
  selected,
  tags,
  amount,
  href,
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
        <Clickable className='flex-none rounded w-20 h-20 overflow-hidden' onClick={onClick} href={href}>
          {image && (
            <img
              src={image}
              alt={name}
              className='w-full h-full aspect-square object-contain'
            />
          )}
        </Clickable>
        <div className='flex-auto pr-3 flex flex-col gap-2 justify-center'>
          <Clickable className='text-left' onClick={onClick} href={href}>
            {name}
          </Clickable>
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
                    key={tag.label}
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
                  <Link
                    key={tag.label}
                    to={tag.to}
                    className='flex text-xs gap-2'
                  >
                    {content}
                  </Link>
                )
              } else if (tag.onClick) {
                return (
                  <button
                    key={tag.label}
                    onClick={tag.onClick}
                    className='flex text-xs gap-2'
                  >
                    {content}
                  </button>
                )
              }

              return (
                <div key={tag.label} className='flex text-xs gap-2'>
                  {content}
                </div>
              )
            })}
          </div>
          {amount && (
            <div className='flex items-center justify-end w-full text-sm'>
              {amount.toString()}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  )
}
