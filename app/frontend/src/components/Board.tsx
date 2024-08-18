import { useEffect, useState } from 'react'
import { sha256 } from '../utils/sha256'
import { Element } from '../enums/Element'
import { GuideOverlay } from './GuideOverlay'
import { useAtom } from 'jotai'
import { RenderActionType, renderBoardAtom } from '../atoms/gameBoardAtom'
import { Cell } from './Cell'
import { CommandList } from './CommandList'

export function Board() {
  const [random] = useState(Math.random())
  const [board, render] = useAtom(renderBoardAtom)

  useEffect(() => {
    const generate = async () => {
      const element = [Element.ChaosI, Element.LifeI, Element.ArcaneI]
      const elements = Array.from(await sha256(random.toString()))
        .slice(0, 12)
        .map((byte) => element[byte % 3])
      render({
        type: RenderActionType.SET,
        elements,
      })
    }
    generate()
  }, [random])

  return (
    <div className='w-full h-screen flex items-center justify-center relative overflow-hidden'>
      <div className='absolute top-0 left-0 h-full overflow-y-auto'>
        <CommandList />
      </div>
      <div className='aspect-[3/4] max-h-[60vh] mx-auto relative'>
        <div className='grid grid-cols-3 grid-rows-4'>
          {board.map((_, i) => (
            <Cell key={i} index={i} />
          ))}
        </div>
        <GuideOverlay
          onDraw={(points, command) => {
            render({
              type: RenderActionType.COMMAND,
              points,
              command,
            })
          }}
        />
      </div>
    </div>
  )
}
