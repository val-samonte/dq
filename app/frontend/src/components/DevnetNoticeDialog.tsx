import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { pubkeyAtom } from '../atoms/keypairAtom'
import { GameAccountAddress } from './GameAccountAddress'

function Inner() {
  const showDialog = useSetAtom(showDialogAtom)
  const pubkey = useAtomValue(pubkeyAtom)

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='p-5 rounded-xl bg-stone-800 max-w-sm mx-auto w-full'>
        <div className='flex flex-col text-center gap-5'>
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>We are currently running on DEVNET</p>
            <p className='text-sm'>
              If you need some SOL for Devnet,{' '}
              <a
                target='_blank'
                href={
                  'https://faucet.solana.com/' +
                  (pubkey ? '?address=' + pubkey : '')
                }
                rel='noreferrer noopener'
                className='font-bold text-amber-400'
              >
                click here
              </a>{' '}
              to navigate to the faucet and obtain funds.
            </p>
          </div>
          {pubkey && <GameAccountAddress />}
        </div>
      </div>
      <button
        className='text-center py-5 w-full'
        onClick={() => showDialog(Dialogs.NONE)}
      >
        Cancel
      </button>
    </div>
  )
}

export function DevnetNoticeDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.DEVNET_NOTICE}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
