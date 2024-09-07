import { ReactNode, useEffect, useMemo } from 'react'
import { CaretLeft, List } from '@phosphor-icons/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { NewGameDialog } from './NewGameDialog'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { keypairAtom } from '../atoms/keypairAtom'
import { ContinueButton } from './ContinueButton'
import { UnlockGameAccountDialog } from './UnlockGameAccountDialog'
import { Title } from './Title'
import { MainMenuDialog } from './MainMenuDialog'
import { connectionAtom } from '../atoms/connectionAtom'
import { solBalanceAtom } from '../atoms/solBalanceAtom'
import { GameAccountDialog } from './GameAccountDialog'
import { ExportPrivateKeyDialog } from './ExportPrivateKeyDialog'

export function MainContainer({ children }: { children: ReactNode }) {
  const connection = useAtomValue(connectionAtom)
  const showDialog = useSetAtom(showDialogAtom)
  const kp = useAtomValue(keypairAtom)
  const location = useLocation()
  const navigate = useNavigate()
  const setBalance = useSetAtom(solBalanceAtom)

  useEffect(() => {
    if (!kp) {
      navigate('/')
    }
  }, [kp, navigate])

  useEffect(() => {
    if (!kp) return

    connection.getBalance(kp.publicKey).then((balance) => {
      const solBalance = balance
      setBalance(solBalance)
    })

    const subscriptionId = connection.onAccountChange(
      kp.publicKey,
      (accountInfo) => {
        const balance = accountInfo.lamports
        setBalance(balance)
      }
    )

    return () => {
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [kp, connection])

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
          <button disabled={!kp} onClick={() => showDialog(Dialogs.MAIN_MENU)}>
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
                <Title />
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
        <ExportPrivateKeyDialog />
        <NewGameDialog />
        <UnlockGameAccountDialog />
        <GameAccountDialog />
        <MainMenuDialog />
      </div>
    </div>
  )
}
