import { BN } from '@coral-xyz/anchor'
import { Suspense, useEffect } from 'react'
import { PillSkeleton } from './PillSkeleton'
import { useAtom, useAtomValue } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { tokenDataAtom } from '../atoms/tokensListAtom'
import { Pill } from './Pill'
import { trimAddress } from '../utils/trimAddress'
import { explorerAddress } from '../utils/explorerAddress'
import { PublicKey } from '@solana/web3.js'
import { formatNumberBN } from '../utils/formatNumber'
import { useNavigate } from 'react-router-dom'

export interface IngredientPillProps {
  asset: PublicKey
  assetType: number
  amount: BN
  consumeMethod: number
}

function Blueprint({ asset, amount }: IngredientPillProps) {
  const id = asset.toBase58()
  const [blueprint, reload] = useAtom(blueprintAtom(id))
  const navigate = useNavigate()

  useEffect(() => {
    reload()
  }, [])

  if (!blueprint) {
    return null
  }

  return (
    <Pill
      onClick={() => {
        navigate(`/blueprints/${id}`)
      }}
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
    <Pill
      href={explorerAddress(id)}
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

export function IngredientPill(props: IngredientPillProps) {
  return (
    <Suspense fallback={<PillSkeleton />}>
      {props.assetType < 2 ? <Blueprint {...props} /> : <Token {...props} />}
    </Suspense>
  )
}
