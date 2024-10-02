import { redirect, useParams } from 'react-router-dom'
import { Nav } from './Nav'
import { useUserWallet } from '../atoms/userWalletAtom'
import { Suspense, useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { userBlueprintsAtom } from '../atoms/userBlueprintsAtom'
import { BlueprintsGrid } from './BlueprintsGrid'
import { PageHeader } from './PageHeader'
import { trimAddress } from '../utils/trimAddress'

function Content() {
  const wallet = useUserWallet()
  const { userId } = useParams()
  const blueprintIds = useAtomValue(userBlueprintsAtom(userId ?? ''))

  const isOwner = useMemo(() => {
    if (!userId) return false
    if (!wallet?.publicKey) return false
    return userId === wallet.publicKey.toBase58()
  }, [userId, wallet])

  if (!userId) {
    redirect('/')
    return null
  }

  return (
    <>
      <BlueprintsGrid ids={blueprintIds}>
        <PageHeader>
          {isOwner ? 'Your' : trimAddress(userId)} Blueprints
        </PageHeader>
      </BlueprintsGrid>
    </>
  )
}

export function UserPage() {
  const { userId } = useParams()
  const reload = useSetAtom(userBlueprintsAtom(userId ?? ''))

  useEffect(() => {
    reload()
  }, [userId])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </div>
  )
}
