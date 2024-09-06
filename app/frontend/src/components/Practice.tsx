import cn from 'classnames'
import { Board } from './Board'
import { CommandList } from './CommandList'
import { atom, useAtom, useSetAtom } from 'jotai'
import { commandsBaseAtom } from '../atoms/commandsAtom'
import {
  boardRawAtom,
  RenderActionType,
  renderBoardAtom,
} from '../atoms/gameBoardAtom'
import { useEffect, useRef, useState } from 'react'
import { commands } from '../constants/commands'
import { CircleProgress } from './CircleProgress'
import { NotEnoughMana } from './NotEnoughMana'
import { manaAtom } from '../atoms/hud'
import { SkillShoutTitle } from './SkillShoutTitle'

export function Practice() {
  const setCommands = useSetAtom(commandsBaseAtom)
  const setBoard = useSetAtom(boardRawAtom)
  const setRender = useSetAtom(renderBoardAtom)
  const [timestampAtom] = useState(atom(0))
  const setTimestamp = useSetAtom(timestampAtom)
  const [turns, setTurns] = useState(0)
  const [duration] = useState(12000)
  const [mana, setMana] = useAtom(manaAtom)
  const [manaSpent, setManaSpent] = useState(0)
  const [totalDamage, setTotalDamage] = useState(0)
  const [damageNumber, setDamageNumber] = useState<number | null>(null)
  const [damageKey, setDamageKey] = useState(0)

  useEffect(() => {
    setCommands([...commands])
    const newBoard = Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 3) + 1
    )
    setBoard(newBoard)
    setRender({ type: RenderActionType.LOAD })
    setMana(0)
    setManaSpent(0)
    setTotalDamage(0)
  }, [setTimestamp])

  const requestRef = useRef(-1)
  const startTimeRef = useRef<number | null>(null)

  const animate = (time: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = time
    }
    const currentTime = time - startTimeRef.current
    setTimestamp(currentTime)

    const turn = Math.floor(currentTime / duration)
    setTurns(turn)

    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    setMana((m) => Math.min(m + 5, 12))
  }, [turns, setMana])

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  return (
    <div className='flex-auto h-full w-full flex flex-col'>
      <div
        className='flex-auto flex flex-col relative'
        style={{
          backgroundImage: 'url("/target_dummy.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className='relative flex-none bg-gradient-to-bl from-black via-black/0 to-black/0'>
          <div className='flex p-3 h-full gap-3 flex-row-reverse'>
            <div className='flex flex-col gap-1 text-right items-end'>
              <span className='flex items-center gap-2'>
                <span className='text-sm bg-gradient-to-r from-red-500/0 to-red-500/30 px-2 py-1'>
                  Total Damage
                </span>
                <span className='text-3xl stroked font-black font-serif tabular-nums'>
                  {totalDamage}
                </span>
              </span>
              <span className='flex items-center gap-2'>
                <span className='text-xs bg-gradient-to-r from-fuchsia-500/0 to-fuchsia-500/30 px-2 py-1'>
                  Mana Spent
                </span>
                <span className='stroked font-black font-serif text-2xl tabular-nums'>
                  {manaSpent}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className='relative flex-auto'></div>
        <div className='relative flex-none bg-gradient-to-tr from-black via-black/0 to-black/0 flex'>
          <div className='flex p-3 h-full gap-3 w-full'>
            <div
              className='h-full aspect-square bg-stone-900'
              style={{
                backgroundImage: 'url("/character.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            ></div>
            <div className='flex flex-col gap-1'>
              <span className='flex items-center gap-2'>
                <span className='text-3xl stroked font-black font-serif'>
                  100
                </span>
              </span>
              <span className='flex items-center gap-2'>
                <span className='stroked font-black font-serif text-2xl'>
                  {mana}
                </span>
                <CircleProgress
                  duration={duration}
                  timestampAtom={timestampAtom}
                />
              </span>
            </div>
            <SkillShoutTitle />
          </div>
        </div>
        <div className='absolute inset-0 pointer-events-none flex items-center justify-center'>
          <div
            key={damageKey}
            className={cn(
              'font-serif font-black text-5xl stroked ml-10 mb-10',
              damageNumber && 'animate-damage-number'
            )}
          >
            {damageNumber}
          </div>
        </div>
        <NotEnoughMana />
      </div>
      <div
        className={cn(
          'relative flex-none grid grid-cols-12 max-h-[50%] transition-all'
        )}
      >
        <div
          className={cn(
            'col-span-7 bg-stone-950/80 h-full overflow-hidden transition-all'
          )}
        >
          <Board
            onDraw={(match) => {
              if (mana - match.command.cost < 0) return
              setMana(mana - match.command.cost)
              setManaSpent(manaSpent + match.command.cost)
              if (match.command.type === 'skill' && match.command.damage) {
                const damageLevel = (match.level ?? 1) - 1
                const damage = match.command.damage[damageLevel]
                setTotalDamage(totalDamage + damage)
                setDamageNumber(damage)
                setDamageKey(Date.now())
              }
            }}
          />
        </div>
        <div className={cn('col-span-5 relative transition-all')}>
          <div className='absolute inset-0 overflow-x-hidden overflow-y-auto bg-stone-950'>
            <CommandList mana={mana} />
          </div>
        </div>
      </div>
    </div>
  )
}
