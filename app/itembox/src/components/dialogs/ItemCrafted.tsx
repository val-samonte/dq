import { atom, useAtom, useAtomValue } from 'jotai'
import { blueprintAtom } from '../../atoms/blueprintAtom'
import { NumberSquareOne, Stack } from '@phosphor-icons/react'
import Dialog from '../Dialog'
import { Suspense, useEffect, useState } from 'react'
import cn from 'classnames'
import { explorerTransaction } from '../../utils/explorerAddress'

export interface ItemCraftedDialogProps {
  blueprintId: string
  amount: string
  signature: string
}

export const itemCraftedAtom = atom<ItemCraftedDialogProps | null>(null)

function BlueprintImage({ id, amount }: { id: string; amount: string }) {
  const blueprint = useAtomValue(blueprintAtom(id))

  if (!blueprint) {
    return null
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='mx-auto max-w-sm w-full rounded overflow-visible aspect-square relative pointer-events-none'>
        <div className='absolute inset-0 flex items-center justify-center scale-[1.8]'>
          <img
            src='/light_long.png'
            className='w-full h-full object-contain animate-spin-slow '
          />
        </div>
        <div className='absolute inset-0 flex items-center justify-center animate-pulse'>
          <img
            src='/light_short.png'
            className='w-full h-full object-contain animate-spin-fast'
          />
        </div>
        <img
          src={blueprint.image}
          alt={blueprint.name}
          className='w-full h-full object-contain relative'
        />
      </div>
      <div className='flex items-center justify-center'>
        <div className='flex items-center gap-2'>
          {blueprint.nonFungible ? (
            <NumberSquareOne size={32} />
          ) : (
            <Stack size={32} />
          )}
          {blueprint.name} x{amount}
        </div>
      </div>
    </div>
  )
}

function Content() {
  const [data, setData] = useAtom(itemCraftedAtom)
  const [lastData, setLastData] = useState(data)

  useEffect(() => {
    if (data) {
      setLastData(data)
    }
  }, [data])

  return (
    <div className='px-5 pt-5 w-full overflow-visible'>
      <div className='pointer-events-auto p-5 max-w-sm mx-auto w-full flex flex-col gap-5 items-center'>
        <div className='flex flex-col gap-2'>
          <p className='text-xl'>Item Crafted!</p>
        </div>

        <Suspense fallback={null}>
          <BlueprintImage
            id={lastData?.blueprintId || ''}
            amount={lastData?.amount.toString() || '1'}
          />
        </Suspense>
        <div className='flex gap-5 w-full'>
          <a
            onClick={() => {
              setData(null)
            }}
            rel='noreferrer noopener'
            target='_blank'
            href={explorerTransaction(lastData?.signature || '')}
            className={cn(
              'w-full text-center',
              'flex items-center justify-center gap-3',
              'rounded px-6 py-3 text-lg',
              'border-2 border-transparent',
              'bg-gray-600'
            )}
          >
            See Transaction
          </a>
        </div>
      </div>
      <button
        className='pointer-events-auto text-center py-5 w-full'
        onClick={() => {
          setData(null)
        }}
      >
        Close
      </button>
    </div>
  )
}

export function ItemCrafted() {
  const [data, setData] = useAtom(itemCraftedAtom)
  return (
    <Dialog
      dark
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
