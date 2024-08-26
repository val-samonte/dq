import { useMemo } from 'react'
import { byteToName } from '../enums/Element'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import {
  AnimatedCellType,
  renderBoardAtom,
  showAuraAtom,
} from '../atoms/gameBoardAtom'
import { availableNextLinkAtom } from '../atoms/availableNextLinkAtom'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'

export function Cell({ index }: { index: number }) {
  const next = useAtomValue(availableNextLinkAtom)
  const points = useAtomValue(inputUnitPointsAtom)
  const renderBoard = useAtomValue(renderBoardAtom)
  const aura = useAtomValue(showAuraAtom)
  const renderCell = renderBoard[index]
  const point = useMemo(() => {
    return { x: index % 3, y: Math.floor(index / 3) }
  }, [index])

  const isTail = useMemo(() => {
    const tail = points[points.length - 1]
    if (!tail) return false
    return tail && tail.x === point.x && tail.y === point.y
  }, [point, points])

  const name = useMemo(() => {
    return byteToName(renderCell.renderElem)
  }, [renderCell])

  const showAura = useMemo(() => {
    if (aura) {
      return renderCell.renderElem === aura
    }
    return (
      (renderCell.renderElem & 0b1100_0000) === 0b1100_0000 ||
      (renderCell.renderElem & 0b0000_1100) === 0b0000_1100
    )
  }, [renderCell, aura])

  const isAvailable = useMemo(() => {
    if (!next) return true
    if (isTail) return true

    return next.some((p) => p.x === point.x && p.y === point.y)
  }, [next, point, isTail, index])

  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        'select-none pointer-events-none',
        'transition-all duration-200',
        isAvailable ? 'brightness-100' : 'brightness-[0.35]'
      )}
    >
      {name !== 'Empty' && (
        <div
          className={cn(
            'relative flex items-center justify-center',
            'w-1/2 aspect-square',
            'select-none pointer-events-none',
            renderCell.type === AnimatedCellType.DESTROY && 'animate-fade-out',
            renderCell.type === AnimatedCellType.REPLACE && 'animate-fade-in',
            renderCell.type === AnimatedCellType.GRAVITY && [
              [
                'animate-fall-1',
                'animate-fall-2',
                'animate-fall-3',
                'animate-fall-4',
                'animate-fall-5',
              ][renderCell.from],
            ]
          )}
        >
          <img
            src={`/${name}.png`}
            alt={name}
            className={cn(
              'object-contain absolute select-none pointer-events-none'
            )}
          />
          {showAura && (
            <img
              src={`/${name}.png`}
              alt={name}
              className={cn(
                'mix-blend-hard-light animate-pulse',
                'object-contain absolute select-none pointer-events-none blur-lg'
              )}
            />
          )}

          <div
            className={cn(
              'opacity-0',
              isAvailable
                ? next && !isTail
                  ? 'animate-fade-in'
                  : 'animate-fade-out'
                : 'animate-fade-out',
              'absolute -inset-3 pointer-events-none'
            )}
          >
            <div className='absolute inset-0 opacity-10 rounded-xl border-white border pointer-events-none ' />
          </div>
        </div>
      )}
    </div>
  )
}
