import { BN } from '@coral-xyz/anchor'
import { Suspense, useEffect } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { tokenDataAtom } from '../atoms/tokensListAtom'
import { trimAddress } from '../utils/trimAddress'
import { explorerAddress } from '../utils/explorerAddress'
import { PublicKey } from '@solana/web3.js'
import { CircleNotch } from '@phosphor-icons/react'
import { PillExpanded } from './PillExpanded'
import { formatNumberBN } from '../utils/formatNumber'

export interface IngredientPillProps {
  asset: PublicKey
  assetType: number
  amount: BN
  consumeMethod: number
}

function Blueprint({ asset, amount }: IngredientPillProps) {
  const id = asset.toBase58()
  const [blueprint, reload] = useAtom(blueprintAtom(id))

  useEffect(() => {
    reload()
  }, [])

  if (!blueprint) {
    return null
  }

  return (
    <PillExpanded
      name={blueprint.name}
      image={blueprint.image}
      tags={[
        {
          label: 'ID',
          value: trimAddress(id),
          to: `/blueprints/${id}`,
        },
        {
          label: 'BY',
          value: trimAddress(blueprint.authority),
          to: `/user/${blueprint.authority}`,
        },
      ]}
      amount={formatNumberBN(amount, 0)}
    />
  )
}

function Token({ asset, amount }: IngredientPillProps) {
  const id = asset.toBase58()
  const token = useAtomValue(tokenDataAtom(id))

  if (!token) {
    return null
  }

  return (
    <PillExpanded
      name={token.name}
      image={token.image}
      tags={[
        {
          label: 'Mint',
          value: trimAddress(id),
          href: explorerAddress(id),
        },
        {
          label: token.symbol,
        },
      ]}
      amount={formatNumberBN(amount, token.decimals)}
    />
  )
}

export function IngredientExpanded(props: IngredientPillProps) {
  return (
    <Suspense
      fallback={
        <div className='bg-black/10 rounded p-2 flex gap-5'>
          <div className='flex-none rounded w-20 h-20 overflow-hidden flex items-center justify-center'>
            <CircleNotch size={28} className='opacity-10 animate-spin' />
          </div>
          <div className='flex flex-col gap-2 justify-center'>
            <div className='opacity-50'>
              <div className='w-32 h-6 animate-pulse bg-white rounded' />
            </div>
            <div className='flex flex-wrap gap-x-3'>
              <div className='flex text-xs gap-2 opacity-50'>
                <div className='w-4 h-4 animate-pulse bg-gray-500 rounded' />
                <div className='w-16 h-4 animate-pulse bg-gray-400 rounded' />
              </div>
              <div className='flex text-xs gap-2 opacity-50'>
                <div className='w-4 h-4 animate-pulse bg-gray-500 rounded' />
                <div className='w-16 h-4 animate-pulse bg-gray-400 rounded' />
              </div>
            </div>
          </div>
        </div>
      }
    >
      {props.assetType < 2 ? <Blueprint {...props} /> : <Token {...props} />}
    </Suspense>
  )
}
