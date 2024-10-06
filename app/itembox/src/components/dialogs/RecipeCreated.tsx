import { atom, useAtom, useAtomValue } from 'jotai'
import Dialog from '../Dialog'
import { Suspense, useEffect, useState } from 'react'
import { IdlAccounts } from '@coral-xyz/anchor'
import { Itembox } from '../../sdk/itembox'
import { blueprintAtom } from '../../atoms/blueprintAtom'
import { NumberSquareOne, Stack } from '@phosphor-icons/react'
import { explorerTransaction } from '../../utils/explorerAddress'
import cn from 'classnames'
import { Link } from 'react-router-dom'
import { IngredientPill } from '../IngredientPill'
import { DialogCommonPanel } from './DialogCommonPanel'
export interface RecipeCreatedDialogProps {
  account: IdlAccounts<Itembox>['recipe']
  publicKey: string
  signature: string
}

export const recipeCreatedAtom = atom<RecipeCreatedDialogProps | null>(null)

function BlueprintImage({ id, amount }: { id: string; amount: string }) {
  const blueprint = useAtomValue(blueprintAtom(id))

  if (!blueprint) {
    return null
  }

  return (
    <div className='flex flex-col gap-5'>
      <div className='mx-auto w-40 rounded overflow-hidden aspect-square'>
        <img
          src={blueprint.image}
          alt={blueprint.name}
          className='w-full h-full object-contain'
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
  const [data, setData] = useAtom(recipeCreatedAtom)
  const [lastData, setLastData] = useState(data)

  useEffect(() => {
    if (data) {
      setLastData(data)
    }
  }, [data])

  return (
    <DialogCommonPanel
      title={'Recipe Created!'}
      onClose={() => {
        setData(null)
      }}
    >
      <Suspense fallback={null}>
        <BlueprintImage
          id={lastData?.account.blueprint.toBase58() || ''}
          amount={lastData?.account.outputAmount.toString() || '0'}
        />
      </Suspense>
      <div className='flex flex-col gap-1 w-full'>
        {lastData?.account.ingredients.map((ingredient) => (
          <IngredientPill {...ingredient} key={ingredient.asset.toBase58()} />
        ))}
      </div>
      <div className='flex gap-5 w-full'>
        <a
          className={cn(
            'w-full text-center',
            'flex items-center justify-center gap-3',
            'rounded px-6 py-3 text-lg',
            'border-2 border-transparent',
            'bg-gray-600/50'
          )}
          rel='noreferrer noopener'
          target='_blank'
          href={explorerTransaction(lastData?.signature || '')}
        >
          Transaction
        </a>
        <Link
          onClick={() => {
            setData(null)
          }}
          to={`/blueprints/${lastData?.account.blueprint.toBase58()}/recipes/${
            lastData?.publicKey
          }`}
          className={cn(
            'w-full text-center',
            'flex items-center justify-center gap-3',
            'rounded px-6 py-3 text-lg',
            'border-2 border-transparent',
            'bg-gray-600/50'
          )}
        >
          See Recipe
        </Link>
      </div>
    </DialogCommonPanel>
  )
}

export function RecipeCreated() {
  const [data, setData] = useAtom(recipeCreatedAtom)
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
