import { useAtom, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { GameAccountAddress } from './GameAccountAddress'

function Inner() {
  const showDialog = useSetAtom(showDialogAtom)

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='p-5 rounded-xl bg-stone-800 max-w-sm mx-auto w-full'>
        <div className='flex flex-col text-center gap-5'>
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>Not Enough Balance</p>
            <p className='text-sm'>
              You need a sufficient SOL balance. <br />
              Fund your game account address to continue
            </p>
          </div>
          <GameAccountAddress />
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

export function NotEnoughBalanceDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.NOT_ENOUGH_BALANCE}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
