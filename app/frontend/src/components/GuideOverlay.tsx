import cn from 'classnames'
import { useRef, useState } from 'react'

interface Point {
  x: number
  y: number
}

export function GuideOverlay() {
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState<Point | null>(null)
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setStartPoint({ x, y })
      setCurrentPoint({ x, y })
      setIsDrawing(true)
    }
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return
    const rect = containerRef.current?.getBoundingClientRect()
    if (rect) {
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      setCurrentPoint({ x, y })
    }
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    setStartPoint(null)
    setCurrentPoint(null)
  }

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={cn('absolute inset-0', 'cursor-pointer')}
    >
      <svg className='absolute inset-0 w-full h-full pointer-events-none select-none'>
        {startPoint && currentPoint && (
          <line
            x1={startPoint.x}
            y1={startPoint.y}
            x2={currentPoint.x}
            y2={currentPoint.y}
            stroke='white'
            strokeWidth='2'
          />
        )}
      </svg>
    </div>
  )
}
