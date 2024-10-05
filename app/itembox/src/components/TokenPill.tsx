import { trimAddress } from '../utils/trimAddress'
import { ReactNode } from 'react'
import { explorerAddress } from '../utils/explorerAddress'
import { Pill } from './Pill'

export interface TokenPillProps {
  id: string
  name: string
  image: string | null
  symbol: string
  children?: ReactNode
  onClick: () => void
}

export function TokenPill({
  id,
  name,
  image,
  symbol,
  children,
  onClick,
}: TokenPillProps) {
  return (
    <Pill
      name={name}
      image={image ?? undefined}
      onClick={onClick}
      selected={!!children}
      tags={[
        {
          label: 'Mint',
          value: trimAddress(id),
          href: explorerAddress(id),
        },
        {
          label: symbol,
        },
      ]}
    >
      {children}
    </Pill>
  )
}
