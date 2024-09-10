import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { keypairAtom } from '../atoms/keypairAtom'
import { useMemo, useState } from 'react'
import { QRCode } from './QRCode'
import cn from 'classnames'
import { CheckCircle, Clipboard } from '@phosphor-icons/react'
import { trimAddress } from '../utils/trimAddress'
import { solBalanceFormattedAtom } from '../atoms/solBalanceAtom'

function Inner() {
  const kp = useAtomValue(keypairAtom)
  const [copiedText, setCopiedText] = useState(false)
  const balance = useAtomValue(solBalanceFormattedAtom)
  const showDialog = useSetAtom(showDialogAtom)

  const pubkey = useMemo(() => {
    if (!kp) return null
    return kp.publicKey.toBase58()
  }, [kp])

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='p-5 rounded-xl bg-stone-800 max-w-sm mx-auto w-full'>
        <div className='flex flex-col text-center gap-5 items-center'>
          <QRCode data={pubkey ?? undefined} />
          <div className='text-2xl'>{balance} SOL</div>
          <button
            className={cn(
              'bg-stone-900 hover:bg-stone-700 transition-colors rounded',
              'px-10 py-2 text-center w-full',
              'flex items-center justify-center gap-2'
            )}
            onClick={async () => {
              try {
                if (!pubkey) return
                await navigator.clipboard.writeText(pubkey)
                setCopiedText(true)
                setTimeout(() => {
                  setCopiedText(false)
                }, 2000)
              } catch (e) {}
            }}
          >
            {copiedText ? (
              <>
                Copied to Clipboard! <CheckCircle size={20} />
              </>
            ) : (
              <>
                {trimAddress(pubkey ?? '')} <Clipboard size={20} />
              </>
            )}
          </button>
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
