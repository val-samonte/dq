import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { gameAccountsAtom } from '../atoms/gameAccountsAtom'
import { Suspense, useMemo } from 'react'
import { unlockGameAccountAtom } from '../atoms/unlockGameAccountAtom'
import { trimAddress } from '../utils/trimAddress'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import cn from 'classnames'

dayjs.extend(relativeTime)

function Card({
  pubkey,
  last_used,
  onClick,
}: {
  pubkey: string
  last_used: number
  time_created: number
  onClick: (pubkey: string) => void
}) {
  const lastPlayed = useMemo(() => {
    return dayjs(last_used).fromNow()
  }, [last_used])

  return (
    <button
      type='button'
      className={cn(
        'bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden',
        'flex flex-col justify-center border border-stone-800',
        'transition-all duration-300 hover:scale-[1.025]'
      )}
      onClick={() => onClick(pubkey)}
    >
      <div className='flex flex-col gap-2'>
        <h3 className='font-serif text-amber-100 flex items-center gap-2'>
          <span>{trimAddress(pubkey)}</span>
        </h3>
        <p className='text-sm'>Last played: {lastPlayed}</p>
      </div>
    </button>
  )
}

function Inner() {
  const gameAccounts = useAtomValue(gameAccountsAtom)
  const setUnlock = useSetAtom(unlockGameAccountAtom)
  const showDialog = useSetAtom(showDialogAtom)

  return (
    <div className='flex flex-col w-full gap-5 px-5 pt-5 overflow-y-auto overflow-x-hidden max-w-lg mx-auto'>
      <div className='flex flex-col w-full gap-5 px-5'>
        <h1 className='font-serif text-center font-bold text-lg'>Load Game</h1>

        {gameAccounts.map((data) => (
          <Suspense key={data.pubkey} fallback={null}>
            <Card
              {...data}
              onClick={(pubkey) => {
                setUnlock(pubkey)
              }}
            />
          </Suspense>
        ))}

        <button
          type='button'
          className={cn(
            'bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden',
            'flex flex-col justify-center border border-stone-800',
            'transition-all duration-300 hover:scale-[1.025]'
          )}
          onClick={() => {}}
        >
          <div className='text-center text-sm w-full'>
            Import Private Key Coming Soon
          </div>
        </button>

        <button className='py-2' onClick={() => showDialog(Dialogs.NONE)}>
          Cancel
        </button>
      </div>
    </div>
  )
}

export function LoadGameAccountDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.LOAD_GAME}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Suspense fallback={null}>
        <Inner />
      </Suspense>
    </Dialog>
  )
}
