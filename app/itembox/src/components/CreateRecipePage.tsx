import { redirect, useParams } from 'react-router-dom'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useEffect, useState } from 'react'
import { Nav } from './Nav'
import { CenterWrapper } from './CenterWrapper'
import { Footer } from './Footer'
import { useUserWallet } from '../atoms/userWalletAtom'
import cn from 'classnames'
import { Coins, Scroll } from '@phosphor-icons/react'
import { allBlueprintsAtom } from '../atoms/allBlueprintsAtom'

function Content() {
  const wallet = useUserWallet()
  const { blueprintId } = useParams()
  const blueprint = useAtomValue(blueprintAtom(blueprintId || ''))
  const blueprintIds = useAtomValue(allBlueprintsAtom)

  const [tab, setTab] = useState('blueprints')

  useEffect(() => {
    if (
      !wallet?.publicKey ||
      wallet.publicKey.toBase58() !== blueprint?.authority
    ) {
      redirect(`/blueprints/${blueprintId}`)
    }
  }, [blueprint, wallet])

  if (!blueprint) {
    // todo: make skeleton
    return null
  }

  return (
    <div className='flex flex-col p-5 gap-5'>
      <div className='flex gap-5'>
        <div className='p-2 w-24 h-24 aspect-square rounded-lg bg-black/20 overflow-hidden'>
          <img
            src={blueprint.image}
            className='w-full h-full object-contain '
          />
        </div>
        <h1 className='text-xl md:text-4xl tracking-wider'>
          <span className='text-base'>New Recipe for</span>
          <br /> {blueprint.name}
        </h1>
      </div>
      <div className={cn('h-[65vh] grid grid-cols-12 gap-5')}>
        <div className='col-span-7 h-full rounded-lg bg-gray-700 flex flex-col overflow-hidden'>
          <div className='grid grid-cols-2 gap-2 px-2 pt-2 bg-black/20'>
            <button
              onClick={() => {
                setTab('blueprints')
              }}
              className={cn(
                tab === 'blueprints'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'rounded-t px-4 py-3 text-lg'
              )}
            >
              <Scroll size={24} />
              Blueprints
            </button>
            <button
              onClick={() => {
                setTab('tokens')
              }}
              className={cn(
                tab === 'tokens'
                  ? 'opacity-100 bg-gray-700'
                  : 'opacity-80 bg-gray-700/50',
                'flex gap-3 transition-all',
                'rounded-t pr-4 md:pr-6 pl-4 py-3 text-lg'
              )}
            >
              <Coins size={24} />
              Tokens
            </button>
          </div>
          <div className='flex flex-col gap-5 p-5'>
            <input
              className={cn(
                'hidden sm:flex',
                'items-center gap-3',
                'rounded px-6 py-3 text-lg',
                'bg-black/20 w-full'
              )}
              type='text'
              placeholder='Search by asset address'
            />
            <div className='grid grid-cols-2 gap-5'>
              {blueprintIds.map((id) => (
                <div className='break-all' key={id}>
                  {id}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='col-span-5 h-full rounded-lg bg-gray-700 overflow-hidden'></div>
      </div>
    </div>
  )
}

export function CreateRecipePage() {
  const { blueprintId } = useParams()
  const reloadBlueprint = useSetAtom(blueprintAtom(blueprintId || ''))
  const reloadBlueprints = useSetAtom(allBlueprintsAtom)

  useEffect(() => {
    reloadBlueprint()
    reloadBlueprints()
  }, [blueprintId])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <CenterWrapper>
        <div className='min-h-screen'>
          <Suspense fallback={null}>
            <Content />
          </Suspense>
        </div>
        <Footer />
      </CenterWrapper>
    </div>
  )
}
