import { useMemo } from 'react'
import { byteToName, Element } from '../enums/Element'
import cn from 'classnames'

export function ElementSymbol({ elem }: { elem: Element }) {
  const imgSrc = useMemo(() => {
    return `/${byteToName(elem)}.svg`
  }, [elem])

  return (
    <div
      className={cn(
        'aspect-square flex items-center justify-center select-none'
      )}
    >
      <img
        src={imgSrc}
        alt={elem + ''}
        className='w-1/2 aspect-square object-contain select-none pointer-events-none'
      />
    </div>
  )
}
