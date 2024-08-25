import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { idbAtom } from '../atoms/idbAtom'
import { useEffect, useRef } from 'react'
import { currentAccountAtom } from '../atoms/currentAccountAtom'
import nacl from 'tweetnacl'
import bs58 from 'bs58'

function Inner() {
  const idb = useAtomValue(idbAtom('root'))
  const setCurrentAccount = useSetAtom(currentAccountAtom)
  const showDialog = useSetAtom(showDialogAtom)
  const currentAccount = useRef<string | null>(null)

  useEffect(() => {
    const generate = async () => {
      if (currentAccount.current) return
      // Annoyingly, Ed25519 is inconsistent in Chrome
      // resorting to tweetnacl for now
      const newKeypair = nacl.sign.keyPair()
      const pubkey = bs58.encode(newKeypair.publicKey)
      currentAccount.current = pubkey
      await idb.put('keypairs', newKeypair.secretKey, pubkey)
      setCurrentAccount(pubkey)

      // try {
      //   const newKeypair = await generateKeyPair()
      //   const pubkey = await getAddressFromPublicKey(newKeypair.publicKey)
      //   await idb.put('keypairs', newKeypair.privateKey, pubkey)
      //   setCurrentAccount(pubkey)
      // } catch (e) {
      //   if (e instanceof SolanaError) {
      //     const newKeypair = await crypto.subtle.generateKey(
      //       {
      //         name: 'Ed25519',
      //         namedCurve: 'Ed25519',
      //       },
      //       false,
      //       ['sign', 'verify']
      //     )
      //     const publicKeyBytes = await crypto.subtle.exportKey(
      //       'raw',
      //       newKeypair.publicKey
      //     )
      //     const pubkey = getAddressDecoder().decode(
      //       new Uint8Array(publicKeyBytes)
      //     )
      //     await idb.put('keypairs', newKeypair.privateKey, pubkey)
      //     setCurrentAccount(pubkey)
      //   }
      // }
      showDialog(Dialogs.NONE)
    }
    void generate()
  }, [idb, setCurrentAccount])

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
