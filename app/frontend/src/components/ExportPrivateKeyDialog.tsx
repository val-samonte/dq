import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { useState } from 'react'
import Dialog from './Dialog'
import { AuthForm } from './AuthForm'
import { trimAddress } from '../utils/trimAddress'
import { decrypt } from '../utils/decrypt'
import { idbAtom } from '../atoms/idbAtom'
import { Keypair } from '@solana/web3.js'
import { currentAccountAtom } from '../atoms/currentAccountAtom'
import bs58 from 'bs58'
import { CheckCircle, Clipboard } from '@phosphor-icons/react'

function Inner() {
  const showDialog = useSetAtom(showDialogAtom)
  const idb = useAtomValue(idbAtom('root'))
  const currentAccount = useAtomValue(currentAccountAtom)
  const [message, setMessage] = useState('')
  const [copiedText, setCopiedText] = useState(false)

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='p-5 rounded-xl bg-stone-800 max-w-sm mx-auto w-full flex flex-col gap-5 items-center'>
        <AuthForm
          username={currentAccount ?? ''}
          onSubmit={async ({ password }) => {
            setMessage('')
            try {
              if (!currentAccount) return
              const record = await idb.get('game_accounts', currentAccount)
              if (!record) return

              const data = await decrypt(record.keypair, password)
              const kp = Keypair.fromSecretKey(data)

              if (kp.publicKey.toBase58() !== currentAccount)
                throw new Error('Account did not matched!')

              try {
                const key = bs58.encode(kp.secretKey)
                await navigator.clipboard.writeText(key)

                setCopiedText(true)
                setTimeout(() => {
                  setCopiedText(false)
                }, 2000)
              } catch (e) {
                console.error(e)
              }
            } catch (e) {
              console.error(e)
              setMessage('Invalid Password')
            }
          }}
          submitLabel={
            copiedText ? (
              <>
                Copied to Clipboard! <CheckCircle size={20} />
              </>
            ) : (
              <>
                Copy Private Key <Clipboard size={20} />
              </>
            )
          }
        >
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>
              Export {trimAddress(currentAccount ?? '')}
            </p>
            {message && <p className='text-sm text-red-400'>{message}</p>}
          </div>
        </AuthForm>
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

export function ExportPrivateKeyDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.EXPORT_PRIVATE_KEY}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
