import { redirect, useParams } from 'react-router-dom'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { useAtomValue, useSetAtom } from 'jotai'
import { Suspense, useEffect, useState } from 'react'
import { Nav } from './Nav'
import { CenterWrapper } from './CenterWrapper'
import { Footer } from './Footer'
import { useUserWallet } from '../atoms/userWalletAtom'
import cn from 'classnames'
import { Coins, HandDeposit, Scroll } from '@phosphor-icons/react'
import { allBlueprintsAtom } from '../atoms/allBlueprintsAtom'
import { trimAddress } from '../utils/trimAddress'

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
      <div className='flex gap-5 items-center'>
        <div className='w-24 h-24 aspect-square rounded-lg bg-black/20 overflow-hidden'>
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
      <div className={cn('h-[60vh] grid grid-cols-12 gap-5')}>
        <div
          className={cn(
            'col-span-12 md:col-span-7 h-full rounded-lg rounded-br-none',
            'bg-gray-700 flex flex-col overflow-hidden'
          )}
        >
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
              <span className='hidden md:inline'>Blueprints</span>
              <span className='inline md:hidden'>BP</span>
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
          <div className='h-full flex flex-col overflow-y-auto overflow-x-hidden relative'>
            <div className='p-3 md:p-5 bg-gray-700 sticky top-0'>
              <input
                className={cn(
                  'z-10',
                  'items-center gap-3',
                  'rounded px-3 md:px-6 py-3 text-lg',
                  'bg-black/20 w-full'
                )}
                type='text'
                placeholder='Search by asset address'
              />
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 px-3 md:px-5 pb-3 md:pb-5'>
              {blueprintIds.map((id) => (
                <div
                  key={id}
                  className={cn(
                    'rounded-lg bg-black/20',
                    'border-2',
                    'flex flex-col',
                    'border-transparent'
                    // 'border-green-400/50'
                  )}
                >
                  <div className='flex p-2 gap-5'>
                    <div className='flex-none rounded w-20 h-20 bg-black/20 overflow-hidden'></div>
                    <div className='flex flex-col gap-1 justify-center'>
                      <div>Copper Sword</div>
                      <div className='flex flex-wrap gap-x-3'>
                        <div className='flex text-xs gap-2'>
                          <span className='text-gray-600'>ID</span>
                          <span className='text-gray-400'>
                            {trimAddress(id)}
                          </span>
                        </div>
                        <div className='flex text-xs gap-2'>
                          <span className='text-gray-600'>BY</span>
                          <span className='text-gray-400'>
                            {trimAddress(id)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='grid md:hidden grid-cols-2 gap-2 px-2 pb-2 text-sm'>
                    <input
                      type='number'
                      min={1}
                      className='flex-1 bg-black/20 rounded px-2 py-1'
                      placeholder='Amount'
                    />
                    <button
                      className={cn(
                        'flex-1 bg-black/20 rounded pl-1 pr-2 py-1 flex gap-2 items-center justify-center'
                      )}
                    >
                      <HandDeposit size={20} />
                      Transfer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className='hidden md:flex md:col-span-5 h-full rounded-lg bg-gray-700 overflow-hidden'></div>
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
