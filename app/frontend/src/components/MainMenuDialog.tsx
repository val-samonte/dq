import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { Title } from './Title'
import { keypairAtom } from '../atoms/keypairAtom'
import { useMemo } from 'react'
import { solBalanceFormattedAtom } from '../atoms/solBalanceAtom'

function Inner() {
  const showDialog = useSetAtom(showDialogAtom)
  const balance = useAtomValue(solBalanceFormattedAtom)
  const [kp, setKeypair] = useAtom(keypairAtom)

  const pubkey = useMemo(() => {
    if (!kp) return null
    return kp.publicKey.toBase58()
  }, [kp])

  return (
    <div className='flex flex-col w-full gap-5 p-5 overflow-auto max-w-lg mx-auto'>
      <div className='flex flex-col w-full gap-10'>
        <Title />
        <ul className='flex flex-col gap-2 px-2'>
          {pubkey && (
            <li className='flex flex-col w-full py-2'>
              <p className='text-sm opacity-50 flex justify-between items-center'>
                <span>Game Account</span>
                <span>{balance} SOL</span>
              </p>
              <button
                onClick={() => {
                  showDialog(Dialogs.GAME_ACCOUNT)
                }}
                className='break-all text-left'
              >
                {pubkey}
              </button>
            </li>
          )}
          <li>
            <button
              className='py-2'
              onClick={() => {
                showDialog(Dialogs.NONE)
              }}
            >
              Resume Game
            </button>
          </li>
          <li>
            <button
              className='py-2'
              onClick={() => {
                showDialog(Dialogs.NONE)
              }}
            >
              Settings
            </button>
          </li>
          <li>
            <button
              className='py-2'
              onClick={() => {
                setKeypair(null)
                showDialog(Dialogs.NONE)
              }}
            >
              Return to Title Screen
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export function MainMenuDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.MAIN_MENU}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
