import { useEffect, useState } from 'react'
import { sha256 } from '../utils/sha256'
import { Element } from '../enums/Element'
import { ElementSymbol } from './ElementSymbol'
import { GuideOverlay } from './GuideOverlay'
import { useAtom } from 'jotai'
import { cellsAtom } from '../atoms/cellsAtom'

export function Board() {
  const [random] = useState(Math.random())
  const [boardData, setBoardData] = useAtom(cellsAtom)

  useEffect(() => {
    const generate = async () => {
      const element = [Element.ChaosI, Element.LifeI, Element.ArcaneI]
      const boardData = Array.from(await sha256(random.toString()))
        .slice(0, 12)
        .map((byte) => element[byte % 3])
      setBoardData(boardData)
    }
    generate()
  }, [random])

  return (
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='aspect-[3/4] max-h-[60vh] mx-auto relative'>
        <div className='grid grid-cols-3 grid-rows-4'>
          {boardData.map((_, i) => (
            <ElementSymbol key={i} index={i} />
          ))}
        </div>
        <GuideOverlay />
      </div>
    </div>
  )
}
