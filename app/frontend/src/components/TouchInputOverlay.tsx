import cn from 'classnames'
import { useMemo, useState } from 'react'
import { Point } from '../types/Point'
import { useAtom, useAtomValue } from 'jotai'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'
import { useMeasure } from '@uidotdev/usehooks'
import { availableNextLinkAtom } from '../atoms/availableNextLinkAtom'
import { CommandMatched, commandMatchedAtom } from '../atoms/commandsAtom'

export function TouchInputOverlay({
  onDraw,
}: {
  onDraw: (match: CommandMatched) => void
}) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [unitPoints, setUnitPoints] = useAtom(inputUnitPointsAtom)
  const next = useAtomValue(availableNextLinkAtom)
  const matched = useAtomValue(commandMatchedAtom)
  const [cursor, setCursor] = useState<Point | null>(null)
  const [containerRef, { width, height }] = useMeasure()
  const cellSize = useMemo(() => {
    if (!width || !height) return null
    return Math.min(width / 3, height / 4)
  }, [width, height])

  const tail = unitPoints[unitPoints.length - 1]

  const displayPoints = useMemo(() => {
    if (!cellSize) return []
    if (unitPoints.length === 0) return []

    const half = cellSize / 2

    return unitPoints.map((point) => {
      const x = point.x * cellSize + half
      const y = point.y * cellSize + half
      return { x, y }
    })
  }, [unitPoints, cellSize])

  const adjacentCells = useMemo(() => {
    if (!cellSize) return []
    if (unitPoints.length === 0) return []
    return getAdjacentCells(tail, cellSize)
  }, [unitPoints, cellSize])

  const getEventPosition = (event: MouseEvent | TouchEvent) => {
    const touch = (event as TouchEvent).touches
      ? (event as TouchEvent).touches[0]
      : null
    const clientX = touch ? touch.clientX : (event as MouseEvent).clientX
    const clientY = touch ? touch.clientY : (event as MouseEvent).clientY

    const t = (event.target as HTMLElement).getBoundingClientRect()
    const displayX = clientX - t.left
    const displayY = clientY - t.top

    return { displayX, displayY }
  }

  const handleStart = (event: React.MouseEvent | React.TouchEvent) => {
    // event.preventDefault()
    if (!cellSize) return

    const { displayX, displayY } = getEventPosition(event.nativeEvent)
    const x = Math.floor(displayX / cellSize)
    const y = Math.floor(displayY / cellSize)

    setUnitPoints([{ x, y }])
    setCursor({ x: displayX, y: displayY })
    setIsDrawing(true)
  }

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    // event.preventDefault()
    if (!cellSize) return
    if (!isDrawing || !tail) return

    const { displayX, displayY } = getEventPosition(event.nativeEvent)
    const cursor = { x: displayX, y: displayY }

    adjacentCells.forEach((cell) => {
      const distance = Math.sqrt(
        (cell.x - cursor.x) ** 2 + (cell.y - cursor.y) ** 2
      )
      if (distance < cellSize / 3) {
        const x = Math.floor(cell.x / cellSize)
        const y = Math.floor(cell.y / cellSize)
        const newPoint = { x, y }
        if (
          unitPoints.every((point) => point.x !== x || point.y !== y) &&
          (next?.some((p) => p.x === x && p.y === y) ?? true)
        ) {
          setUnitPoints([...unitPoints, newPoint])
        } else if (unitPoints.length > 1) {
          const prev = unitPoints[unitPoints.length - 2]
          if (prev.x === x && prev.y === y) {
            setUnitPoints(unitPoints.slice(0, -1))
          }
        }
      }
    })

    setCursor(cursor)
  }

  const handleEnd = () => {
    if (matched) {
      onDraw(matched)
    }
    setIsDrawing(false)
    setUnitPoints([])
    setCursor(null)
  }

  const initPointStyle =
    unitPoints.length > 0 && cellSize
      ? {
          width: cellSize / 8,
          height: cellSize / 8,
          top: unitPoints[0].y * cellSize + cellSize / 2 - cellSize / 16,
          left: unitPoints[0].x * cellSize + cellSize / 2 - cellSize / 16,
        }
      : undefined

  const resultStyles =
    tail && cellSize
      ? {
          width: cellSize,
          height: cellSize,
          top: tail.y * cellSize,
          left: tail.x * cellSize,
        }
      : undefined

  return (
    <div
      ref={containerRef}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseOut={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onContextMenu={(e) => {
        e.preventDefault()
      }}
      className={cn('absolute inset-0 text-white', 'cursor-pointer')}
    >
      {initPointStyle && (
        <div
          className='absolute bg-white rounded-full pointer-events-none'
          style={initPointStyle}
        />
      )}
      <svg className='absolute inset-0 w-full h-full pointer-events-none select-none'>
        {displayPoints.map((point, i) => {
          if (next?.length === 0 && i === displayPoints.length - 1) return null
          const nextPoint = displayPoints[i + 1] ?? cursor
          if (!nextPoint) return null
          return (
            <line
              key={i}
              x1={point.x}
              y1={point.y}
              x2={nextPoint.x}
              y2={nextPoint.y}
              stroke='white'
              strokeWidth='5'
              strokeLinecap='round'
            />
          )
        })}
      </svg>
      {resultStyles && matched && (
        <div
          className='animate-fade-in absolute text-center flex items-center justify-center flex-col pointer-events-none'
          style={resultStyles}
        >
          {/* 
          <div className='absolute -top-4 pointer-events-none flex items-center justify-center text-center'>
            <div className='absolute font-bold bottom-0 text-black bg-white rounded px-3 py-1 text-xs pointer-events-none break-normal whitespace-nowrap'>
              {`${matched.command.type === 'skill' ? 'Cast ' : ''}${
                matched.name
              }`}
            </div>
          </div>
           */}
          <img
            src={
              matched.command.type === 'skill'
                ? '/CastPath.svg'
                : '/FoundPath.svg'
            }
            alt=''
            className={cn(
              matched.command.type === 'skill' && 'animate-spin',
              'absolute inset-0 w-full h-full aspect-square pointer-events-none '
            )}
          />
        </div>
      )}
      {resultStyles && next?.length === 0 && !matched && (
        <img
          src='/EndPath.svg'
          alt=''
          style={resultStyles}
          className='absolute pointer-events-none animate-fade-in'
        />
      )}
    </div>
  )
}

function getAdjacentCells(point: Point, cellSize: number): Point[] {
  const { x: unitX, y: unitY } = point
  const half = cellSize / 2
  const x = unitX * cellSize + half
  const y = unitY * cellSize + half

  return [
    { x: x - cellSize, y },
    { x: x + cellSize, y },
    { x, y: y - cellSize },
    { x, y: y + cellSize },
    { x: x - cellSize, y: y - cellSize },
    { x: x + cellSize, y: y - cellSize },
    { x: x - cellSize, y: y + cellSize },
    { x: x + cellSize, y: y + cellSize },
  ]
}
