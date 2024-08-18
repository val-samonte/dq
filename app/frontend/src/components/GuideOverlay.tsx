import cn from 'classnames'
import { useMemo, useState } from 'react'
import { Point } from '../types/Point'
import { useAtom, useAtomValue } from 'jotai'
import { inputUnitPointsAtom } from '../atoms/inputUnitPointsAtom'
import { useMeasure } from '@uidotdev/usehooks'
import { availableNextLinkAtom } from '../atoms/availableNextLinkAtom'
import { commandsAtom } from '../atoms/commandsAtom'
import { Command } from '../types/Command'

export function GuideOverlay({
  onDraw,
}: {
  onDraw?: (points: Point[], command: Command) => void
}) {
  const [isDrawing, setIsDrawing] = useState(false)
  const [unitPoints, setUnitPoints] = useAtom(inputUnitPointsAtom)
  const next = useAtomValue(availableNextLinkAtom)
  const command = useAtomValue(commandsAtom)
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

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!cellSize) return

    const t = (event.target as HTMLElement).getBoundingClientRect()
    const displayX = event.clientX - t.left
    const displayY = event.clientY - t.top
    const x = Math.floor(displayX / cellSize)
    const y = Math.floor(displayY / cellSize)

    setUnitPoints([{ x, y }])
    setCursor({ x: displayX, y: displayY })
    setIsDrawing(true)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!cellSize) return
    if (!isDrawing || !tail) return

    const t = (event.target as HTMLElement).getBoundingClientRect()
    const cursor = { x: event.clientX - t.left, y: event.clientY - t.top }

    adjacentCells.forEach((cell) => {
      const distance = Math.sqrt(
        (cell.x - cursor.x) ** 2 + (cell.y - cursor.y) ** 2
      )
      if (distance < cellSize / 4) {
        const x = Math.floor(cell.x / cellSize)
        const y = Math.floor(cell.y / cellSize)
        const newPoint = { x, y }
        if (
          unitPoints.every((point) => point.x !== x || point.y !== y) &&
          (next?.some((p) => p.x === x && p.y === y) ?? true)
        ) {
          setUnitPoints([...unitPoints, newPoint])
        }
      }
    })

    setCursor(cursor)
  }

  const handleMouseUp = () => {
    if (command.length === 1 && next?.length === 0) {
      onDraw?.(unitPoints, command[0])
    }
    setIsDrawing(false)
    setUnitPoints([])
    setCursor(null)
  }

  const handleMouseOut = () => {
    setIsDrawing(false)
    setUnitPoints([])
    setCursor(null)
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      className={cn('absolute inset-0 text-white', 'cursor-pointer')}
    >
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
      {next?.length === 0 && command.length === 1 && tail && cellSize && (
        <svg className='absolute inset-0 w-full h-full pointer-events-none select-none'>
          <circle
            cx={tail.x * cellSize + cellSize / 2}
            cy={tail.y * cellSize + cellSize / 2}
            r={cellSize / 4}
            stroke='white'
            strokeWidth='8'
            fill='transparent'
          />
        </svg>
      )}
      {next?.length === 0 && command.length !== 1 && tail && cellSize && (
        <svg className='absolute inset-0 w-full h-full pointer-events-none select-none'>
          <line
            x1={tail.x * cellSize + cellSize / 4}
            y1={tail.y * cellSize + cellSize / 4}
            x2={tail.x * cellSize + (cellSize * 3) / 4}
            y2={tail.y * cellSize + (cellSize * 3) / 4}
            stroke='white'
            strokeWidth='8'
            strokeLinecap='round'
          />
          <line
            x1={tail.x * cellSize + (cellSize * 3) / 4}
            y1={tail.y * cellSize + cellSize / 4}
            x2={tail.x * cellSize + cellSize / 4}
            y2={tail.y * cellSize + (cellSize * 3) / 4}
            stroke='white'
            strokeWidth='8'
            strokeLinecap='round'
          />
        </svg>
      )}
    </div>
  )
}

function getAdjacentCells(point: Point, cellSize: number): Point[] {
  const { x: unitX, y: unitY } = point
  const half = cellSize / 2
  const x = unitX * cellSize + half
  const y = unitY * cellSize + half
  cellSize
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
