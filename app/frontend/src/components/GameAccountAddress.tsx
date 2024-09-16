import { useState } from 'react'
import { solBalanceFormattedAtom } from '../atoms/solBalanceAtom'
import { useAtomValue } from 'jotai'
import { QRCode } from './QRCode'
import { pubkeyAtom } from '../atoms/keypairAtom'
import cn from 'classnames'
import { CheckCircle, Clipboard } from '@phosphor-icons/react'
import { trimAddress } from '../utils/trimAddress'

export function GameAccountAddress() {
  const [copiedText, setCopiedText] = useState(false)
  const balance = useAtomValue(solBalanceFormattedAtom)
  const pubkey = useAtomValue(pubkeyAtom)

  return (
    <>
      <QRCode data={pubkey ?? undefined} />
      <div className='text-2xl font-serif'>{balance} SOL</div>
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
    </>
  )
}
