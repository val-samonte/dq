import { useMemo } from 'react'
import { byteToName } from '../enums/Element'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { AnimatedCellType, renderBoardAtom } from '../atoms/gameBoardAtom'
import { availableNextLinkAtom } from '../atoms/availableNextLinkAtom'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'

export function Cell({ index }: { index: number }) {
  const next = useAtomValue(availableNextLinkAtom)
  const points = useAtomValue(inputUnitPointsAtom)
  const renderBoard = useAtomValue(renderBoardAtom)
  const renderCell = renderBoard[index]

  const name = useMemo(() => {
    return byteToName(renderCell.renderElem)
  }, [renderCell])

  const isAvailable = useMemo(() => {
    if (!next) return true
    const point = { x: index % 3, y: Math.floor(index / 3) }

    const tail = points[points.length - 1]
    if (!tail) return true
    if (point.x === tail.x && point.y === tail.y) return true

    return next.some((p) => p.x === point.x && p.y === point.y)
  }, [next, points, index])

  return (
    <div
      className={cn(
        'flex-col',
        'aspect-square flex items-center justify-center select-none',
        'transition-opacity duration-300',
        isAvailable ? 'opacity-100' : 'opacity-30'
      )}
    >
      {name !== 'Empty' && (
        <img
          key={renderCell.type}
          src={`/${name}.svg`}
          alt={name}
          className={cn(
            renderCell.type === AnimatedCellType.DESTROY && 'animate-fade-out',
            renderCell.type === AnimatedCellType.REPLACE && 'animate-fade-in',
            renderCell.type === AnimatedCellType.GRAVITY &&
              ['animate-fall-1', 'animate-fall-2', 'animate-fall-3'][
                renderCell.from
              ],
            'w-1/2 aspect-square object-contain select-none pointer-events-none'
          )}
        />
      )}
    </div>
  )
}
