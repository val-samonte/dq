import { useAtomValue } from 'jotai'
import { TokenPill, TokenPillProps } from './TokenPill'
import { queriedTokenAtom, tokensListAtom } from '../atoms/tokensListAtom'
import { Suspense } from 'react'
import { PillSkeleton } from './PillSkeleton'

function TokenPillWrapper(token: Omit<TokenPillProps, 'onClick'>) {
  // select token
  // check if token is selected, display child

  return <TokenPill key={token.id} {...token} onClick={() => {}} />
}

function QueriedToken() {
  const token = useAtomValue(queriedTokenAtom)

  if (!token) {
    return null
  }

  return <TokenPillWrapper key={token.id} {...token} />
}

export function TokensList() {
  const tokens = useAtomValue(tokensListAtom)

  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-5 px-3 lg:px-5 pb-3 lg:pb-5'>
      {tokens.map((token) => (
        <TokenPillWrapper key={token.id} {...token} />
      ))}
      <Suspense fallback={<PillSkeleton />}>
        <QueriedToken />
      </Suspense>
    </div>
  )
}
