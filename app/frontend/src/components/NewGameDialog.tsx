import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { idbAtom } from '../atoms/idbAtom'
import { useEffect, useMemo, useState } from 'react'
import { currentAccountAtom } from '../atoms/currentAccountAtom'
import bs58 from 'bs58'
import { AuthForm } from './AuthForm'
import { CheckCircle, Clipboard } from '@phosphor-icons/react'
import cn from 'classnames'
import { trimAddress } from '../utils/trimAddress'
import { QRCode } from './QRCode'
import { connectionAtom } from '../atoms/connectionAtom'
import { Keypair } from '@solana/web3.js'
import { encrypt } from '../utils/encrypt'
import { keypairAtom } from '../atoms/keypairAtom'

function Inner() {
  const connection = useAtomValue(connectionAtom)
  const idb = useAtomValue(idbAtom('root'))
  const setCurrentKeypair = useSetAtom(keypairAtom)
  const setCurrentAccount = useSetAtom(currentAccountAtom)
  const showDialog = useSetAtom(showDialogAtom)

  const [step, setStep] = useState(0)
  const [keypair, setKeypair] = useState<Keypair>(Keypair.generate())
  const [password, setPassword] = useState('')
  const [copiedText, setCopiedText] = useState(false)
  const [copied, setCopied] = useState(false)
  const [balance, setBalance] = useState(0)

  const reset = () => {
    setStep(0)
    setKeypair(Keypair.generate())
    setPassword('')
    setCopiedText(false)
    setCopied(false)
    setBalance(0)
  }

  const pubkey = useMemo(() => {
    return keypair.publicKey.toBase58()
  }, [keypair])

  useEffect(() => {
    reset()
  }, [])

  useEffect(() => {
    if (!keypair) return

    connection.getBalance(keypair.publicKey).then((balance) => {
      const solBalance = balance
      setBalance(solBalance)
    })

    const subscriptionId = connection.onAccountChange(
      keypair.publicKey,
      (accountInfo) => {
        const balance = accountInfo.lamports
        setBalance(balance)
      }
    )

    return () => {
      connection.removeAccountChangeListener(subscriptionId)
    }
  }, [keypair, connection])

  const onComplete = async () => {
    const encryptedKeypair = await encrypt(keypair.secretKey, password)
    const now = Date.now()
    await idb.put('game_accounts', {
      pubkey,
      keypair: encryptedKeypair,
      last_used: now,
      time_created: now,
    })
    setCurrentKeypair(keypair)
    setCurrentAccount(pubkey)
    showDialog(Dialogs.NONE)
    setTimeout(() => {
      reset()
    }, 1000)
  }

  return (
    <div className='p-5 w-full'>
      <div className='p-5 rounded-xl bg-stone-800 max-w-sm w-full'>
        {step === 0 && (
          <AuthForm
            newAccount
            username={pubkey}
            onSubmit={({ password }) => {
              setPassword(password)
              setStep(1)
            }}
            submitLabel='Next'
          >
            <div className='flex flex-col gap-2'>
              <p className='font-bold'>
                Create a password for this game account
              </p>
              <p className='text-sm'>
                Note that you are responsible for remembering it; losing this
                password will prevent you from accessing the game account.
              </p>
            </div>
          </AuthForm>
        )}
        {step === 1 && (
          <div className='flex flex-col text-center gap-5'>
            <div className='flex flex-col gap-2'>
              <p className='font-bold'>Backup your game account</p>
              <p className='text-sm'>
                Click the button below to copy your private key and import it
                into your favorite Solana wallet.
              </p>
              <p className='text-sm'>
                Don't just paste it anywhere! Your private key must be kept
                secret.
              </p>
            </div>
            <button
              className={cn(
                'bg-stone-900 hover:bg-stone-700 transition-colors rounded',
                'px-10 py-2 text-center w-full',
                'flex items-center justify-center gap-2'
              )}
              onClick={async () => {
                try {
                  const key = bs58.encode(keypair.secretKey)
                  await navigator.clipboard.writeText(key)
                  setCopiedText(true)
                  setCopied(true)
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
                  Copy Private Key <Clipboard size={20} />
                </>
              )}
            </button>
            <button
              onClick={() => {
                setStep(2)
                setCopiedText(false)
                setCopied(false)
              }}
              className='px-3 py-2 bg-amber-100 rounded text-stone-800'
            >
              {copied ? 'Next' : 'Skip'}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className='flex flex-col text-center gap-5 items-center'>
            <div className='flex flex-col gap-2'>
              <p className='font-bold'>Fund your game account</p>
              <p className='text-sm'>
                DeezQuest: TriNexus is a fully on-chain game. This means your
                game account needs to be funded with enough balance to interact
                with Solana.
              </p>
              <p className='text-sm'>
                Scan the QR code below with your Solana wallet or copy the
                public key of your game account and send approximately 0.1 SOL
                to it.
              </p>
            </div>
            <QRCode data={pubkey} />
            <button
              className={cn(
                'bg-stone-900 hover:bg-stone-700 transition-colors rounded',
                'px-10 py-2 text-center w-full',
                'flex items-center justify-center gap-2'
              )}
              onClick={async () => {
                try {
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
                  {trimAddress(pubkey)} <Clipboard size={20} />
                </>
              )}
            </button>
            <button
              onClick={onComplete}
              className='w-full px-3 py-2 bg-amber-100 rounded text-stone-800'
            >
              {balance > 0 ? 'Next' : 'Skip'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function NewGameDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.NEW_GAME}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
