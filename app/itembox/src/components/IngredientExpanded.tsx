import { BN } from '@coral-xyz/anchor'
import { Suspense, useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { tokenDataAtom } from '../atoms/tokensListAtom'
import { trimAddress } from '../utils/trimAddress'
import { explorerAddress } from '../utils/explorerAddress'
import { PublicKey } from '@solana/web3.js'
import { CircleNotch } from '@phosphor-icons/react'
import { PillExpanded } from './PillExpanded'
import { formatNumberBN } from '../utils/formatNumber'
import { userTokenAccountAtom } from '../atoms/userTokenAtom'
import { useUserWallet } from '../atoms/userWalletAtom'

export interface IngredientPillProps {
  asset: PublicKey
  assetType: number
  amount: BN
  consumeMethod: number
  selectedAssets?: string[]
}

function Blueprint({
  asset,
  assetType,
  amount,
  selectedAssets,
}: IngredientPillProps) {
  const id = asset.toBase58()
  const blueprint = useAtomValue(blueprintAtom(id))
  const account = useAtomValue(
    userTokenAccountAtom(assetType === 1 ? `${asset}_${assetType}` : '')
  )

  const balance = useMemo(() => {
    if (!account) return new BN(0)
    return new BN(account.amount.toString())
  }, [account])

  const hasEnoughBalance = useMemo(() => {
    return balance.gte(amount)
  }, [balance, amount])

  if (!blueprint) {
    return null
  }

  const amountDisplay =
    assetType === 0
      ? selectedAssets && selectedAssets.length > 0
        ? trimAddress(selectedAssets[0])
        : 'No Asset Selected'
      : `${formatNumberBN(balance, 0)} / ${formatNumberBN(amount, 0)}`

  const highlight =
    assetType === 0 ? (selectedAssets?.length ?? 0) > 0 : hasEnoughBalance

  return (
    <PillExpanded
      selected={highlight}
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
      amount={amountDisplay}
    />
  )
}

function Token({ asset, assetType, amount }: IngredientPillProps) {
  const id = asset.toBase58()
  const token = useAtomValue(tokenDataAtom(id))
  const account = useAtomValue(userTokenAccountAtom(`${asset}_${assetType}`))

  const balance = useMemo(() => {
    if (!account) return new BN(0)
    return new BN(account.amount.toString())
  }, [account])

  const hasEnoughBalance = useMemo(() => {
    return balance.gte(amount)
  }, [balance, amount])

  if (!token) {
    return null
  }

  return (
    <PillExpanded
      selected={hasEnoughBalance}
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
      amount={`${formatNumberBN(balance, token.decimals)} / ${formatNumberBN(
        amount,
        token.decimals
      )}`}
    />
  )
}

export function IngredientExpanded(props: IngredientPillProps) {
  const wallet = useUserWallet()
  const reload = useSetAtom(
    userTokenAccountAtom(`${props.asset}_${props.assetType}`)
  )
  const reloadBp = useSetAtom(
    blueprintAtom(props.assetType < 2 ? props.asset.toBase58() : '')
  )

  useEffect(() => {
    reload()
    reloadBp()
  }, [wallet?.publicKey])

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
