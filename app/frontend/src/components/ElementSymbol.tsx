import { useMemo } from 'react'
import { byteToName } from '../enums/Element'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { cellsAtom } from '../atoms/cellsAtom'

export function ElementSymbol({ index }: { index: number }) {
  const cell = useAtomValue(cellsAtom)
  const name = useMemo(() => {
    return byteToName(cell[index])
  }, [cell, index])

  return (
    <div
      className={cn(
        'aspect-square flex items-center justify-center select-none'
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
