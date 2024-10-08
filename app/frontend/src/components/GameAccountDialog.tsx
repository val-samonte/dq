import { useAtom, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { GameAccountAddress } from './GameAccountAddress'

function Inner() {
  const showDialog = useSetAtom(showDialogAtom)

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='p-5 rounded-xl bg-stone-800 max-w-sm mx-auto w-full'>
        <div className='flex flex-col text-center gap-5 items-center'>
          <GameAccountAddress />
          <button
            onClick={() => showDialog(Dialogs.EXPORT_PRIVATE_KEY)}
            className='w-full px-3 py-2 bg-amber-100 rounded text-stone-800'
          >
            Export Private Key
          </button>
        </div>
      </div>
      <button
        className='text-center py-5 w-full'
        onClick={() => showDialog(Dialogs.NONE)}
      >
        Close
      </button>
    </div>
  )
}

export function GameAccountDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.GAME_ACCOUNT}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
