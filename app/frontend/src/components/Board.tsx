import { useEffect, useState } from 'react'
import { sha256 } from '../utils/sha256'
import { Element } from '../enums/Element'
import { ElementSymbol } from './ElementSymbol'
import { GuideOverlay } from './GuideOverlay'

export function Board() {
  const [random] = useState(Math.random())
  const [boardData, setBoardData] = useState<Element[]>([])

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
      <div className='grid grid-cols-3 grid-rows-4 aspect-[3/4] max-h-[60vh] mx-auto relative'>
        {boardData.map((element, i) => (
          <ElementSymbol key={i} elem={element} />
        ))}
        <GuideOverlay />
      </div>
    </div>
  )
}
