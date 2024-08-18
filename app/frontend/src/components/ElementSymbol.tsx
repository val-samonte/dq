import { useMemo } from 'react'
import { byteToName, Element } from '../enums/Element'

export function ElementSymbol({ elem }: { elem: Element }) {
  const name = useMemo(() => {
    return byteToName(elem)
  }, [elem])

  return (
    <img
      src={`/${name}.svg`}
      alt={name}
      className='w-4 h-4 aspect-square object-contain select-none pointer-events-none'
    />
  )
}
