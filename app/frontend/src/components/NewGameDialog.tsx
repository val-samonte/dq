import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { idbAtom } from '../atoms/idbAtom'
import { useEffect } from 'react'
import { currentAccountAtom } from '../atoms/currentAccountAtom'
import {
  generateKeyPair,
  getAddressDecoder,
  getAddressFromPublicKey,
  SolanaError,
} from '@solana/web3.js'

function Inner() {
  const idb = useAtomValue(idbAtom('root'))
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom)
  const showDialog = useSetAtom(showDialogAtom)

  useEffect(() => {
    if (currentAccount) return
    const generate = async () => {
      try {
        const newKeypair = await generateKeyPair()
        const pubkey = await getAddressFromPublicKey(newKeypair.publicKey)
        await idb.put('keypairs', newKeypair.privateKey, pubkey)
        setCurrentAccount(pubkey)
      } catch (e) {
        if (e instanceof SolanaError) {
          const newKeypair = await crypto.subtle.generateKey(
            {
              name: 'Ed25519',
              namedCurve: 'Ed25519',
            },
            false,
            ['sign', 'verify']
          )
          const publicKeyBytes = await crypto.subtle.exportKey(
            'raw',
            newKeypair.publicKey
          )
          const pubkey = getAddressDecoder().decode(
            new Uint8Array(publicKeyBytes)
          )
          await idb.put('keypairs', newKeypair.privateKey, pubkey)
          setCurrentAccount(pubkey)
        }
      }
      showDialog(Dialogs.NONE)
    }
    void generate()
  }, [idb, currentAccount, setCurrentAccount])

  // todo: show an option for the user to provide a pin to encrypt the keypair
  return <div>Generating a new account</div>
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
