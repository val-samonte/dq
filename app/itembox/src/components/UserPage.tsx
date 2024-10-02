import { useParams } from 'react-router-dom'
import { Nav } from './Nav'
import { useUserWallet } from '../atoms/userWalletAtom'
import { Suspense, useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { userBlueprintsAtom } from '../atoms/userBlueprintsAtom'

function Content() {
  const wallet = useUserWallet()
  const { userId } = useParams()
  const blueprintIds = useAtomValue(userBlueprintsAtom(userId ?? ''))

  const isOwner = useMemo(() => {
    if (!userId) return false
    if (!wallet?.publicKey) return false
    return userId === wallet.publicKey.toBase58()
  }, [userId, wallet])

  return (
    <>
      <div className='py-32 px-5 text-center flex items-center justify-center'>
        <h2 className='text-3xl tracking-wider'>
          {isOwner ? 'Your' : 'Explore'} Blueprints
        </h2>
      </div>
      {JSON.stringify(blueprintIds)}
    </>
  )
}

export function UserPage() {
  const { userId } = useParams()
  const reload = useSetAtom(userBlueprintsAtom(userId ?? ''))

  useEffect(() => {
    reload()
  }, [])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <Suspense fallback={null}>
        <Content />
      </Suspense>
    </div>
  )
}
