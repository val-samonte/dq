import cn from 'classnames'
import { Board } from './Board'
import { CommandList } from './CommandList'
import { useSetAtom } from 'jotai'
import { commandsBaseAtom } from '../atoms/commandsAtom'
import {
  boardRawAtom,
  RenderActionType,
  renderBoardAtom,
} from '../atoms/gameBoardAtom'
import { useEffect } from 'react'
import { commands } from '../constants/commands'

export function Practice() {
  const setCommands = useSetAtom(commandsBaseAtom)
  const setBoard = useSetAtom(boardRawAtom)
  const setRender = useSetAtom(renderBoardAtom)

  useEffect(() => {
    setCommands([...commands])
    const newBoard = Array.from(
      { length: 12 },
      () => Math.floor(Math.random() * 3) + 1
    )
    setBoard(newBoard)
    setRender({ type: RenderActionType.LOAD })
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
                  0
                </span>
              </span>
              <span className='flex items-center gap-2'>
                <span className='text-xs bg-gradient-to-r from-fuchsia-500/0 to-fuchsia-500/30 px-2 py-1'>
                  Mana Spent
                </span>
                <span className='stroked font-black font-serif text-2xl tabular-nums'>
                  0
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className='relative flex-auto'></div>
        <div className='relative flex-none bg-gradient-to-tr from-black via-black/0 to-black/0'>
          <div className='flex p-3 h-full gap-3'>
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
              <span className='flex items-end gap-2'>
                <span className='text-3xl stroked font-black font-serif'>
                  1279
                </span>
              </span>
              <span className='flex items-end gap-2'>
                <span className='stroked font-black font-serif text-2xl'>
                  469
                </span>
              </span>
            </div>
          </div>
        </div>
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
          <Board />
        </div>
        <div className={cn('col-span-5 relative transition-all')}>
          <div className='absolute inset-0 overflow-x-hidden overflow-y-auto bg-stone-950'>
            <CommandList />
          </div>
        </div>
      </div>
    </div>
  )
}
