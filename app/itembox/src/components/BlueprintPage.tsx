import { Link, useParams } from 'react-router-dom'
import { CenterWrapper } from './CenterWrapper'
import { Nav } from './Nav'
import { Suspense, useEffect } from 'react'
import { Footer } from './Footer'
import { useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import cn from 'classnames'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FilePlus, NumberSquareOne, Shapes, Stack } from '@phosphor-icons/react'
import { PageHeader } from './PageHeader'
import { useUserWallet } from '../atoms/userWalletAtom'

function Content() {
  const wallet = useUserWallet()
  const { blueprintId } = useParams()
  const blueprint = useAtomValue(blueprintAtom(blueprintId || ''))

  if (!blueprint) {
    return null
  }

  return (
    <>
      <div
        className={cn(
          'w-full p-5 flex-col md:flex-row',
          'flex gap-5 md:gap-10'
        )}
      >
        <div className='md:max-w-[36vh] min-w-80 w-full aspect-square flex flex-col gap-5'>
          <div className='bg-black/20 rounded-lg overflow-hidden'>
            <img
              src={blueprint.image}
              alt={blueprint.name}
              className='object-contain w-full aspect-square'
            />
          </div>
          <div className='flex items-center justify-center opacity-50'>
            {blueprint.nonFungible ? (
              <div className='flex items-center gap-5'>
                <NumberSquareOne size={32} />
                Non-Fungible Asset
              </div>
            ) : (
              <div className='flex items-center gap-5'>
                <Stack size={32} />
                Fungible Asset
              </div>
            )}
          </div>
        </div>

        <div className='flex flex-col gap-5 h-full'>
          <h1 className='text-4xl tracking-wider pt-5 md:pt-10'>
            {blueprint.name}
          </h1>
          <div className='flex flex-col md:flex-row gap-5'>
            <Link
              to={`/blueprints/${blueprintId}`}
              className='flex-1 flex flex-col gap-1 p-3 rounded bg-black/10'
            >
              <div className='text-xs uppercase tracking-wider opacity-50'>
                ID
              </div>
              <div className='text-sm break-all'>{blueprint.id}</div>
            </Link>
            <Link
              to={`/user/${blueprint.authority}`}
              className='flex-1 flex flex-col gap-1 p-3 rounded bg-black/10'
            >
              <div className='text-xs uppercase tracking-wider opacity-50'>
                Creator
              </div>
              <div className='text-sm break-all'>{blueprint.authority}</div>
            </Link>
          </div>
          <div className='text-xl opacity-80 flex flex-col gap-5'>
            <Markdown remarkPlugins={[remarkGfm]}>
              {blueprint.description}
            </Markdown>
          </div>
          {wallet?.publicKey?.toBase58() === blueprint.authority && (
            <div className='flex items-center justify-center md:justify-end gap-5 mt-10'>
              <button
                onClick={() => {}}
                className={cn(
                  'w-fit',
                  'flex items-center gap-3',
                  'rounded pr-6 pl-4 py-3 text-lg',
                  'border-2 border-transparent',
                  'bg-gray-600/50'
                )}
              >
                <FilePlus size={24} />
                Mint
              </button>
              <button
                onClick={() => {}}
                className={cn(
                  'md:w-fit portrait:flex-auto',
                  'flex items-center justify-center gap-3',
                  'rounded pr-6 pl-4 py-3 text-lg text-center text-nowrap',
                  'border-2 border-amber-300/50',
                  'bg-gradient-to-t from-amber-800 to-yellow-800'
                )}
              >
                <Shapes className='flex-none' size={24} />
                Create Recipe
              </button>
            </div>
          )}
        </div>
      </div>
      <PageHeader>{blueprint.name} Recipes</PageHeader>
    </>
  )
}

export function BlueprintPage() {
  const { blueprintId } = useParams()
  const reload = useSetAtom(blueprintAtom(blueprintId || ''))

  useEffect(() => {
    reload()
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
