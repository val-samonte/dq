import cn from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'

interface Point {
  x: number
  y: number
}

interface Rect extends Point {
  width: number
  height: number
}

export function GuideOverlay() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [rect, setRect] = useState<Rect | null>(null)
  const [unitPoints, setUnitPoints] = useState<Point[]>([])
  const [cursor, setCursor] = useState<Point | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const resize = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      setRect({
        width: rect.width,
        height: rect.height,
        x: rect.left,
        y: rect.top,
      })
    }
    window.addEventListener('resize', resize)
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  const { width, height } = useMemo(() => {
    if (!rect) return { width: 0, height: 0 }
    return {
      width: rect.width / 3,
      height: rect.height / 4,
    }
  }, [rect])

  const displayPoints = useMemo(() => {
    if (unitPoints.length === 0) return []

    const halfWidth = width / 2
    const halfHeight = height / 2

    return unitPoints.map((point) => {
      const x = point.x * width + halfWidth
      const y = point.y * height + halfHeight
      return { x, y }
    })
  }, [unitPoints, width, height])

  const adjacentCells = useMemo(() => {
    if (unitPoints.length === 0) return []
    const tail = unitPoints[unitPoints.length - 1]
    return getAdjacentCells(tail, width, height)
  }, [unitPoints, width, height])

  const handleMouseDown = (event: React.MouseEvent) => {
    if (!rect) return

    const displayX = event.clientX - rect.x
    const displayY = event.clientY - rect.y
    const x = Math.floor(displayX / width)
    const y = Math.floor(displayY / height)

    setUnitPoints([{ x, y }])
    setCursor({ x: displayX, y: displayY })
    setIsDrawing(true)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!rect) return
    const tail = unitPoints[unitPoints.length - 1]
    if (!isDrawing || !tail) return

    const cursor = { x: event.clientX - rect.x, y: event.clientY - rect.y }
    // todo: compare distance to each adjacent cells
    // if distance is less than half of width or height, add that cell to unitPoints
    adjacentCells.forEach((cell) => {
      const distance = Math.sqrt(
        (cell.x - cursor.x) ** 2 + (cell.y - cursor.y) ** 2
      )
      if (distance < width / 6) {
        const x = Math.floor(cell.x / width)
        const y = Math.floor(cell.y / height)
        const newPoint = { x, y }
        if (unitPoints.every((point) => point.x !== x || point.y !== y)) {
          setUnitPoints([...unitPoints, newPoint])
        }
      }
    })

    setCursor(cursor)
  }

  const handleMouseUp = () => {
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
      className={cn('absolute inset-0 text-white', 'cursor-pointer')}
    >
      <svg className='absolute inset-0 w-full h-full pointer-events-none select-none'>
        {displayPoints.map((point, i) => {
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
    </div>
  )
}

function getAdjacentCells(
  point: Point,
  width: number,
  height: number
): Point[] {
  const { x: unitX, y: unitY } = point
  const x = unitX * width + width / 2
  const y = unitY * height + height / 2

  return [
    { x: x - width, y },
    { x: x + width, y },
    { x, y: y - height },
    { x, y: y + height },
    { x: x - width, y: y - height },
    { x: x + width, y: y - height },
    { x: x - width, y: y + height },
    { x: x + width, y: y + height },
  ]
}
