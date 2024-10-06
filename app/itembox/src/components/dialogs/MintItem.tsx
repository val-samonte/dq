import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import Dialog from '../Dialog'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { DialogCommonPanel } from './DialogCommonPanel'
import { PublicKey } from '@solana/web3.js'
import { trimAddress } from '../../utils/trimAddress'
import { Check, Nut } from '@phosphor-icons/react'
import cn from 'classnames'
import { blueprintAtom } from '../../atoms/blueprintAtom'
import { NumberInput } from '../NumberInput'
import { useUserWallet } from '../../atoms/userWalletAtom'
import { messageAtom } from './MessageDialog'
import { itemboxSdkAtom } from '../../atoms/itemboxSdkAtom'
import { explorerTransaction } from '../../utils/explorerAddress'

interface MintItemDialogProps {
  blueprintId: string
}

export const mintItemAtom = atom<MintItemDialogProps | null>(null)

function Content() {
  const sdk = useAtomValue(itemboxSdkAtom)
  const [data, setData] = useAtom(mintItemAtom)
  const [lastData, setLastData] = useState(data)
  const showMessage = useSetAtom(messageAtom)
  const wallet = useUserWallet()
  const blueprint = useAtomValue(blueprintAtom(lastData?.blueprintId || ''))
  const [receiver, setReceiver] = useState(wallet?.publicKey?.toBase58() || '')
  const [amount, setAmount] = useState('1')
  const [busy, setBusy] = useState(false)

  const trimmedReceiver = useMemo(() => {
    try {
      const parsed = new PublicKey(receiver)
      return `(${trimAddress(parsed.toBase58())})`
    } catch (e) {}
    return ''
  }, [receiver])

  useEffect(() => {
    if (data) {
      setLastData(data)
    }
  }, [data])

  const onSubmit = async () => {
    if (!blueprint) return
    if (!trimmedReceiver) return
    if (!amount || amount === '0') return

    setBusy(true)

    try {
      const result = await sdk.mintItem(
        new PublicKey(blueprint.id),
        new PublicKey(receiver),
        amount
      )

      setBusy(false)
      setData(null)

      showMessage({
        title: `Item Successfully Minted!`,
        message: (
          <>
            <p>
              Minted {amount} {blueprint.name} to {trimmedReceiver}
            </p>
            <a
              target='_blank'
              href={explorerTransaction(result.signature)}
              rel='noreferrer noopener'
              className={cn(
                'w-full text-center',
                'flex items-center justify-center gap-3',
                'rounded pl-4 pr-6 py-3 text-lg',
                'border-2 border-transparent',
                'bg-gray-600/50'
              )}
            >
              See Transaction
            </a>
          </>
        ),
      })
    } catch (e) {
      console.error(e)
      setBusy(false)
      setData(null)

      showMessage({
        title: 'Error Minting Item',
        message: (
          <>
            <p>There was an error minting your item!</p>
          </>
        ),
      })
    }
  }

  return (
    <DialogCommonPanel
      title={'Mint Item'}
      onClose={() => {
        setData(null)
      }}
    >
      <div className='flex flex-col gap-2 w-full'>
        <label className='px-1 text-xs tracking-wider opacity-50 flex items-center justify-between'>
          <span className='uppercase'>Mint To</span>
          {receiver && (
            <span className='flex items-center gap-1'>
              {trimmedReceiver} <Check size={12} />
            </span>
          )}
        </label>
        <input
          disabled={busy}
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          onFocus={(e) => e.target.select()}
          className={cn(
            'flex items-center gap-3',
            'rounded px-4 py-3 text-lg',
            'bg-black/20 w-full'
          )}
          type='text'
          placeholder='Receiver Address'
        />
      </div>
      {!blueprint?.nonFungible && (
        <div className='flex flex-col gap-2 w-full'>
          <label className='px-1 text-xs tracking-wider opacity-50 flex items-center justify-between'>
            <span className='uppercase'>Amount</span>
          </label>
          <NumberInput
            disabled={busy}
            decimals={0}
            value={amount}
            onChange={(e) => setAmount(e)}
            onFocus={(e) => e.target.select()}
            className={cn(
              'flex items-center gap-3',
              'rounded px-4 py-3 text-lg',
              'bg-black/20 w-full'
            )}
            placeholder='Amount'
          />
        </div>
      )}
      <button
        disabled={busy}
        onClick={onSubmit}
        className={cn(
          'w-full text-center',
          'flex items-center justify-center gap-3',
          'rounded pl-4 pr-6 py-3 text-lg',
          'border-2 border-transparent',
          'bg-gray-600/50'
        )}
      >
        <Nut size={24} />
        Mint {blueprint?.name || 'name'}
      </button>
    </DialogCommonPanel>
  )
}

export function MintItem() {
  const [data, setData] = useAtom(mintItemAtom)
  return (
    <Dialog
      show={!!data}
      onClose={() => {
        setData(null)
      }}
    >
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </Dialog>
  )
}
