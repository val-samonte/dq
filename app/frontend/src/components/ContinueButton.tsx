import { useAtom, useAtomValue, useSetAtom } from 'jotai'
import { currentAccountAtom } from '../atoms/currentAccountAtom'
import { idbAtom } from '../atoms/idbAtom'
import { useEffect, useState } from 'react'
import cn from 'classnames'
import { keypairAtom } from '../atoms/keypairAtom'
import { unlockGameAccountAtom } from '../atoms/unlockGameAccountAtom'

export function ContinueButton() {
  const kp = useAtomValue(keypairAtom)
  const idb = useAtomValue(idbAtom('root'))
  const [currentAccount, setCurrentAccount] = useAtom(currentAccountAtom)
  const [accountExists, setAccountExists] = useState(false)
  const setUnlock = useSetAtom(unlockGameAccountAtom)

  useEffect(() => {
    const checkAccount = async () => {
      if (kp) return
      if (currentAccount) {
        const gameAccount = await idb.get('game_accounts', currentAccount)
        if (!gameAccount) {
          setAccountExists(false)
          setCurrentAccount(null)
        } else {
          setAccountExists(true)
        }
      } else {
        setAccountExists(false)
      }
    }
    void checkAccount()
  }, [kp, idb, currentAccount])

  return (
    <button
      onClick={() => {
        if (!currentAccount) return
        setUnlock(currentAccount)
      }}
      disabled={!accountExists}
      className={cn(
        accountExists ? 'opacity-100' : 'pointer-events-none opacity-30',
        'px-3 py-2 transition-all'
      )}
    >
      Continue
    </button>
  )
}
