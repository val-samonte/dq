import { useMemo } from 'react'
import { byteToName } from '../enums/Element'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { boardRawAtom, renderBoardAtom } from '../atoms/gameBoardAtom'
import { availableNextLinkAtom } from '../atoms/availableNextLinkAtom'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'

export function Cell({ index }: { index: number }) {
  const cell = useAtomValue(boardRawAtom)
  const next = useAtomValue(availableNextLinkAtom)
  const points = useAtomValue(inputUnitPointsAtom)
  const renderBoard = useAtomValue(renderBoardAtom)
  const name = useMemo(() => {
    return byteToName(cell[index])
  }, [cell, index])

  const isAvailable = useMemo(() => {
    if (!next) return true
    const point = { x: index % 3, y: Math.floor(index / 3) }

    const tail = points[points.length - 1]
    if (!tail) return true
    if (point.x === tail.x && point.y === tail.y) return true

    return next.some((p) => p.x === point.x && p.y === point.y)
  }, [next, points, index])

  const renderCell = renderBoard[index]

  return (
    <div
      className={cn(
        'flex-col',
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
      <span>{renderCell.type}</span>
    </div>
  )
}
