import { useEffect, useState } from 'react'
import { sha256 } from '../utils/sha256'
import { Element } from '../enums/Element'
import { TouchInputOverlay } from './TouchInputOverlay'
import { useAtom, useSetAtom } from 'jotai'
import { RenderActionType, renderBoardAtom } from '../atoms/gameBoardAtom'
import { Cell } from './Cell'
import { CommandList } from './CommandList'
import { commandCallTitleAtom } from '../atoms/commandCallTitleAtom'
import { SkillShoutTitle } from './SkillShoutTitle'
import { SoundFX } from './SoundFX'

export function Board() {
  const [random] = useState(Math.random())
  const [board, render] = useAtom(renderBoardAtom)
  const setSkillTitle = useSetAtom(commandCallTitleAtom)

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
    <div className='w-full h-screen flex items-center justify-center relative overflow-hidden text-white'>
      <div className='absolute top-0 left-0 h-full overflow-y-auto hidden md:flex'>
        <CommandList />
      </div>
      <SkillShoutTitle />
      <div className='aspect-[3/4] max-h-[60vh] h-full mx-auto relative'>
        <div className='grid grid-cols-3 grid-rows-4 w-full h-full'>
          {board.map((_, i) => (
            <Cell key={i} index={i} />
          ))}
        </div>
        <TouchInputOverlay
          onDraw={({ command, unitPoints }) => {
            setSkillTitle({ command, unitPoints })
            render({
              type: RenderActionType.COMMAND,
              points: unitPoints,
              command,
            })
          }}
        />
      </div>
    </div>
  )
}
