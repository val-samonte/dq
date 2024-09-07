import { ReactNode, useMemo } from 'react'
import { CaretLeft, List } from '@phosphor-icons/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { NewGameDialog } from './NewGameDialog'
import { Link, useLocation } from 'react-router-dom'
import { keypairAtom } from '../atoms/keypairAtom'
import { ContinueButton } from './ContinueButton'
import { UnlockGameAccountDialog } from './UnlockGameAccountDialog'

export function MainContainer({ children }: { children: ReactNode }) {
  const showDialog = useSetAtom(showDialogAtom)
  const kp = useAtomValue(keypairAtom)
  const location = useLocation()

  const navLinks = useMemo(() => {
    const common = [
      {
        type: 'back',
        value: '/',
      },
    ]
    if (location.pathname.toLowerCase() === '/tutorial') {
      return [
        ...common,
        {
          type: 'title',
          value: 'Tutorial',
        },
      ]
    }
    if (location.pathname.toLowerCase() === '/tutorial/basics') {
      return [
        {
          type: 'back',
          value: '/tutorial',
        },
        {
          type: 'title',
          value: 'Tutorial',
        },
        {
          type: 'title',
          value: '/ Basics',
        },
      ]
    }
    if (location.pathname.toLowerCase() === '/tutorial/battle') {
      return [
        {
          type: 'back',
          value: '/tutorial',
        },
        {
          type: 'title',
          value: 'Tutorial',
        },
        {
          type: 'title',
          value: '/ Battle',
        },
      ]
    } else if (location.pathname.toLowerCase().includes('practice')) {
      return [
        ...common,
        {
          type: 'title',
          value: 'Practice',
        },
      ]
    } else if (location.pathname.toLowerCase().includes('challenge')) {
      return [
        ...common,
        {
          type: 'title',
          value: 'Challenge',
        },
      ]
    }
    return [
      {
        type: 'title',
        value: 'Home',
      },
    ]
  }, [location])

  return (
    <div className='fixed inset-0 overflow-hidden'>
      <div className='flex flex-col max-w-lg mx-auto bg-stone-950 h-full'>
        <nav className='flex flex-none px-3 py-2 justify-between items-center'>
          <div className='font-serif flex gap-2 items-center'>
            {navLinks.map((item, i) => {
              if (item.type === 'back') {
                return (
                  <Link to={item.value} key={'nav_' + i}>
                    <CaretLeft size={32} />
                  </Link>
                )
              }
              return <span key={'nav_' + i}>{item.value}</span>
            })}
          </div>
          <button>
            <List size={32} />
          </button>
        </nav>
        <main className='flex-auto flex flex-col overflow-hidden'>
          {children}
        </main>
        {!kp && (
          <div className='animate-fade-in fixed inset-0 bg-black flex flex-col p-10 items-center justify-center z-50'>
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
                  <ContinueButton />
                </li>
                <li>
                  <button className='px-3 py-2'>Load Game</button>
                </li>
              </ul>
            </div>
          </div>
        )}
        <NewGameDialog />
        <UnlockGameAccountDialog />
      </div>
    </div>
  )
}
