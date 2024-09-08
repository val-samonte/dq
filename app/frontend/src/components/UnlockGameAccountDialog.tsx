import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { unlockGameAccountAtom } from '../atoms/unlockGameAccountAtom'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { useEffect, useRef, useState } from 'react'
import Dialog from './Dialog'
import { AuthForm } from './AuthForm'
import { trimAddress } from '../utils/trimAddress'
import { decrypt } from '../utils/decrypt'
import { idbAtom } from '../atoms/idbAtom'
import { Keypair } from '@solana/web3.js'
import { keypairAtom } from '../atoms/keypairAtom'
import { currentAccountAtom } from '../atoms/currentAccountAtom'
import {
  GameAccountActionType,
  gameAccountsAtom,
} from '../atoms/gameAccountsAtom'

function Inner() {
  const idb = useAtomValue(idbAtom('root'))
  const [unlockAccount, setUnlockAccount] = useAtom(unlockGameAccountAtom)
  const setGameAccount = useSetAtom(gameAccountsAtom)
  const setCurrentAccount = useSetAtom(currentAccountAtom)
  const setKeypair = useSetAtom(keypairAtom)
  const account = useRef(unlockAccount)
  const [message, setMessage] = useState('')

  if (!unlockAccount) return null

  return (
    <div className='p-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='p-5 rounded-xl bg-stone-800 max-w-sm mx-auto w-full flex flex-col gap-5 items-center'>
        <AuthForm
          username={unlockAccount}
          onSubmit={async ({ password }) => {
            setMessage('')
            try {
              const record = await idb.get('game_accounts', unlockAccount)
              if (!record) return

              const data = await decrypt(record.keypair, password)
              const kp = Keypair.fromSecretKey(data)

              if (kp.publicKey.toBase58() !== unlockAccount)
                throw new Error('Account did not matched!')

              await setGameAccount({
                type: GameAccountActionType.UPDATE,
                payload: {
                  pubkey: record.pubkey,
                  last_used: Date.now(),
                },
              })

              setCurrentAccount(unlockAccount)
              setKeypair(kp)
              setUnlockAccount(null)
            } catch (e) {
              console.error(e)
              setMessage('Invalid Password')
            }
          }}
          submitLabel='Continue Game'
        >
          <div className='flex flex-col gap-2'>
            <p className='font-bold'>
              Unlock {trimAddress(account.current ?? '')}
            </p>
            {message && <p className='text-sm text-red-400'>{message}</p>}
          </div>
        </AuthForm>

        <button onClick={() => setUnlockAccount(null)}>Cancel</button>
      </div>
    </div>
  )
}

export function UnlockGameAccountDialog() {
  const showDialog = useSetAtom(showDialogAtom)
  const [unlockAccount, setUnlockAccount] = useAtom(unlockGameAccountAtom)

  useEffect(() => {
    if (unlockAccount) {
      showDialog(Dialogs.NONE)
    }
  }, [unlockAccount])

  return (
    <Dialog show={!!unlockAccount} onClose={() => setUnlockAccount(null)}>
      <Inner />
    </Dialog>
  )
}
