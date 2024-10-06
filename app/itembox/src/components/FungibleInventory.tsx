import { BN } from '@coral-xyz/anchor'
import { Suspense, useEffect } from 'react'
import { PillSkeleton } from './PillSkeleton'
import { tokenDataAtom } from '../atoms/tokensListAtom'
import { useAtomValue, useSetAtom } from 'jotai'
import { trimAddress } from '../utils/trimAddress'
import { explorerAddress } from '../utils/explorerAddress'
import { Pill } from './Pill'
import { userTokenAccountAtom } from '../atoms/userTokenAtom'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { formatNumberBN } from '../utils/formatNumber'
import { useUserWallet } from '../atoms/userWalletAtom'

// export const fungibleSelectionsAtom = atom<string[]>([])

interface TokenProps {
  mint_type: string
}

function TokenContent({ mint_type }: TokenProps) {
  const [mint] = mint_type.split('_')
  const token = useAtomValue(tokenDataAtom(mint))
  const account = useAtomValue(userTokenAccountAtom(mint_type))

  if (!token) {
    return null
  }

  return (
    <Pill
      name={token.name}
      image={token.image}
      tags={[
        {
          label: 'Mint',
          value: trimAddress(mint),
          href: explorerAddress(mint),
        },
        {
          label: token.symbol,
        },
      ]}
      amount={formatNumberBN(
        new BN(account?.amount.toString() || '0'),
        token.decimals
      )}
    />
  )
}

function BlueprintContent({ mint_type }: TokenProps) {
  const [mint] = mint_type.split('_')
  const blueprint = useAtomValue(blueprintAtom(mint))
  const account = useAtomValue(userTokenAccountAtom(mint_type))

  if (!blueprint) {
    return null
  }

  return (
    <Pill
      name={blueprint.name}
      image={blueprint.image}
      tags={[
        {
          label: 'ID',
          value: trimAddress(mint),
          to: `/blueprints/${mint}`,
        },
        {
          label: 'BY',
          value: trimAddress(blueprint.authority),
          to: `/user/${blueprint.authority}`,
        },
      ]}
      amount={formatNumberBN(new BN(account?.amount.toString() || '0'), 0)}
    />
  )
}

function Token({ mint_type }: TokenProps) {
  const wallet = useUserWallet()
  const [mint, assetType] = mint_type.split('_')
  const reload = useSetAtom(userTokenAccountAtom(mint_type))
  const reloadBp = useSetAtom(blueprintAtom(assetType === '1' ? mint : ''))

  useEffect(() => {
    reload()
    reloadBp()
  }, [mint_type, wallet?.publicKey])

  return (
    <Suspense fallback={<PillSkeleton />}>
      {assetType === '1' ? (
        <BlueprintContent mint_type={mint_type} />
      ) : (
        <TokenContent mint_type={mint_type} />
      )}
    </Suspense>
  )
}

export function FungibleInventory({ mint_types }: { mint_types: string[] }) {
  return (
    <>
      {mint_types.map((mint_type) => (
        <Token key={mint_type} mint_type={mint_type} />
      ))}
    </>
  )
}
