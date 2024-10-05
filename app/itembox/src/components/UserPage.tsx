import { Link, useParams } from 'react-router-dom'
import { Nav } from './Nav'
import { useUserWallet } from '../atoms/userWalletAtom'
import { Suspense, useEffect, useMemo } from 'react'
import { useAtomValue, useSetAtom } from 'jotai'
import { userBlueprintsAtom } from '../atoms/userBlueprintsAtom'
import { BlueprintsGrid } from './BlueprintsGrid'
import { PageHeader } from './PageHeader'
import { trimAddress } from '../utils/trimAddress'
import cn from 'classnames'
import { CopySimple, FilePlus } from '@phosphor-icons/react'
import { CenterWrapper } from './CenterWrapper'
import { Footer } from './Footer'
import { CopyToClipboard } from './CopyToClipboard'

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
      <BlueprintsGrid
        ids={blueprintIds}
        whenEmpty={
          <div className='flex flex-col gap-10 items-center justify-center text-center'>
            {isOwner ? (
              <>
                <span className='opacity-50 text-lg'>
                  You do not have any Blueprints yet!
                </span>
                <Link
                  to={'/blueprints'}
                  className={cn(
                    'w-fit',
                    'flex items-center gap-3',
                    'rounded pr-6 pl-4 py-3 text-lg',
                    'border-2 border-amber-300/50',
                    'bg-gradient-to-t from-amber-800 to-yellow-800'
                  )}
                >
                  <FilePlus size={24} />
                  Create a Blueprint
                </Link>
              </>
            ) : (
              <span className='opacity-50 text-lg'>
                User has no blueprints yet
              </span>
            )}
          </div>
        }
      >
        <PageHeader>
          <span>{isOwner ? 'Your' : trimAddress(userId!)} Blueprints</span>
          {userId && (
            <div className='text-sm'>
              <CopyToClipboard content={userId}>
                <span className='flex items-center gap-2 bg-black/20 rounded px-2 py-1'>
                  <span>Copy Address</span>
                  <CopySimple size={20} />
                </span>
              </CopyToClipboard>
            </div>
          )}
        </PageHeader>
      </BlueprintsGrid>
    </>
  )
}

export function UserPage() {
  const { userId } = useParams()
  const wallet = useUserWallet()
  const reload = useSetAtom(userBlueprintsAtom(userId ?? ''))

  useEffect(() => {
    reload()
  }, [userId, wallet])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <CenterWrapper>
        <Suspense fallback={null}>
          <Content />
        </Suspense>
        <Footer />
      </CenterWrapper>
    </div>
  )
}
