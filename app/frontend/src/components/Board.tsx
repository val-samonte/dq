import { useEffect, useState } from 'react'
import { sha256 } from '../utils/sha256'
import { Element } from '../enums/Element'
import { TouchInputOverlay } from './TouchInputOverlay'
import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { RenderActionType, renderBoardAtom } from '../atoms/gameBoardAtom'
import { Cell } from './Cell'
import { CommandMatched, lastCommandCalledAtom } from '../atoms/commandsAtom'
import { commandManaDiffAtom } from '../atoms/hud'

export function Board({
  onDraw,
}: {
  onDraw?: (match: CommandMatched) => void
}) {
  const [random] = useState(Math.random())
  const [board, render] = useAtom(renderBoardAtom)
  const manaDiff = useAtomValue(commandManaDiffAtom)
  const setCommandCalled = useSetAtom(lastCommandCalledAtom)

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
    <div
      className='aspect-[3/4] h-full mx-auto relative flex items-center justify-center'
      style={{
        backgroundImage: 'url("/frame.png")',
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='grid grid-cols-3 grid-rows-4 w-full h-full scale-[0.99]'>
        {board.map((_, i) => (
          <Cell key={i} index={i} />
        ))}
      </div>
      <TouchInputOverlay
        onDraw={(match) => {
          if (manaDiff !== null && manaDiff < 0) return
          if (onDraw) onDraw(match)
          setCommandCalled(match)
          render({
            type: RenderActionType.COMMAND,
            points: match.unitPoints,
            command: match.command,
          })
        }}
      />
    </div>
  )
}
