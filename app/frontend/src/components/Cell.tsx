import { useMemo } from 'react'
import { byteToName } from '../enums/Element'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { cellsAtom } from '../atoms/cellsAtom'
import { availableNextLinkAtom } from '../atoms/availableNextLinkAtom'

export function Cell({ index }: { index: number }) {
  const cell = useAtomValue(cellsAtom)
  const next = useAtomValue(availableNextLinkAtom)
  const name = useMemo(() => {
    return byteToName(cell[index])
  }, [cell, index])

  const isAvailable = useMemo(() => {
    if (!next) return true
    const point = { x: index % 3, y: Math.floor(index / 3) }
    return next.some((p) => p.x === point.x && p.y === point.y)
  }, [next, index])

  return (
    <div
      className={cn(
        'aspect-square flex items-center justify-center select-none',
        'transition-opacity duration-300',
        isAvailable ? 'opacity-100' : 'opacity-30'
      )}
    >
      <img
        src={`/${name}.svg`}
        alt={name}
        className='w-1/2 aspect-square object-contain select-none pointer-events-none'
      />
    </div>
  )
}
