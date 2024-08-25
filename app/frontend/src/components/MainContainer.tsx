import { ReactNode } from 'react'
import { List } from '@phosphor-icons/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { currentAccountAtom } from '../atoms/currentAccountAtom'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { NewGameDialog } from './NewGameDialog'

export function MainContainer({ children }: { children: ReactNode }) {
  const currentAccount = useAtomValue(currentAccountAtom)
  const showDialog = useSetAtom(showDialogAtom)

  return (
    <div className='fixed inset-0 overflow-hidden flex flex-col'>
      <nav className='flex flex-none px-3 py-2 justify-between items-center'>
        <div className='font-serif'>Practice</div>
        <button>
          <List size={32} />
        </button>
      </nav>
      <main className='flex-auto flex flex-col overflow-hidden'>
        {children}
      </main>
      {!currentAccount && (
        <div className='animate-fade-in fixed inset-0 bg-black flex flex-col p-10 items-center justify-center'>
          <div className='flex flex-col h-full gap-10'>
            <div className='flex-auto flex flex-col items-center justify-center'>
              <h1 className='flex flex-col gap-2'>
                <small className='text-sm opacity-90'>DeezQuest</small>
                <span className='text-4xl font-serif '>TriNexus</span>
              </h1>
            </div>
            <ul className='flex flex-col items-center text-center gap-2'>
              <li>
                <button
                  className='px-3 py-2'
                  onClick={() => showDialog(Dialogs.NEW_GAME)}
                >
                  New Game
                </button>
              </li>
              <li>
                <button className='px-3 py-2 pointer-events-none opacity-30'>
                  Continue
                </button>
              </li>
              <li>
                <button className='px-3 py-2'>Load Game</button>
              </li>
            </ul>
          </div>
        </div>
      )}
      <NewGameDialog />
    </div>
  )
}
