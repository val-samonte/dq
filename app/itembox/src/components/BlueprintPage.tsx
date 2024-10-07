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
import {
  CopySimple,
  FilePlus,
  LinkSimple,
  NumberSquareOne,
  PlugsConnected,
  Shapes,
  Stack,
} from '@phosphor-icons/react'
import { useUserWallet } from '../atoms/userWalletAtom'
import { CopyToClipboard } from './CopyToClipboard'
import { BlueprintRecipes } from './BlueprintRecipes'
import { mintItemAtom } from './dialogs/MintItem'
import { messageAtom } from './dialogs/MessageDialog'

function Content() {
  const wallet = useUserWallet()
  const { blueprintId } = useParams()
  const blueprint = useAtomValue(blueprintAtom(blueprintId || ''))
  const showMint = useSetAtom(mintItemAtom)
  const showMessage = useSetAtom(messageAtom)

  if (!blueprint) {
    return null
  }

  const owner = wallet?.publicKey?.toBase58() === blueprint.authority

  return (
    <>
      <div
        className={cn(
          'w-full p-5 flex-col md:flex-row',
          'flex gap-5 md:gap-10'
        )}
      >
        <div className='md:max-w-[36vh] min-w-80 w-full aspect-square flex flex-col gap-5'>
          <div className='rounded-lg overflow-hidden'>
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

        <div className='flex-auto flex flex-col gap-5 h-full'>
          <h1 className='text-4xl tracking-wider pt-5 md:pt-10'>
            {blueprint.name}
          </h1>
          <div className='flex flex-col gap-3'>
            <div
              // to={`/blueprints/${blueprintId}`}
              className='flex-1 flex flex-col lg:flex-row justify-between gap-2 p-3 rounded bg-black/10'
            >
              <div className='text-sm uppercase tracking-wider opacity-50'>
                ID
              </div>
              <div className='text-sm flex items-center gap-2'>
                <span className='break-all'>{blueprint.id}</span>
                {blueprintId && (
                  <CopyToClipboard content={blueprintId}>
                    <CopySimple size={20} />
                  </CopyToClipboard>
                )}
              </div>
            </div>
            <div className='flex-1 flex flex-col lg:flex-row justify-between gap-2 p-3 rounded bg-black/10'>
              <div className='text-sm uppercase tracking-wider opacity-50'>
                Creator{owner && <span>&nbsp;(You)</span>}
              </div>
              <div className='text-sm flex items-center gap-2'>
                <span className='break-all'>{blueprint.authority}</span>
                <CopyToClipboard content={blueprint.authority}>
                  <CopySimple size={20} />
                </CopyToClipboard>
                <Link to={`/user/${blueprint.authority}`}>
                  <LinkSimple size={20} />
                </Link>
              </div>
            </div>
          </div>
          <div className='text-xl opacity-80 flex flex-col gap-5'>
            <Markdown remarkPlugins={[remarkGfm]}>
              {blueprint.description}
            </Markdown>
          </div>
          <div
            className={cn(
              'flex flex-col md:flex-row items-center justify-center md:justify-end gap-5 mt-10'
            )}
          >
            {owner && (
              <button
                onClick={() => {
                  showMessage({
                    title: `Integrate ${blueprint.name}`,
                    message: (
                      <>
                        <p className='text-center'>
                          Integrate your item into one of the following games:
                        </p>
                        <ul className='flex flex-col gap-5'>
                          <li>
                            <a
                              target='_blank'
                              rel='noreferrer noopener'
                              href={`https://isekai.deez.quest/${blueprint.id}/import`}
                            >
                              <img
                                src='/trinexus-banner.png'
                                alt='TriNexus'
                                className='w-full object-contain rounded'
                              />
                            </a>
                          </li>
                        </ul>
                      </>
                    ),
                  })
                }}
                className={cn(
                  'w-full md:w-fit',
                  'flex items-center justify-center gap-3',
                  'rounded pr-6 pl-4 py-3 text-lg text-center text-nowrap',
                  'border-2 border-transparent',
                  'bg-gray-600/50'
                )}
              >
                <PlugsConnected size={24} />
                Integrate
              </button>
            )}
            {wallet?.publicKey?.toBase58() === blueprint.mintAuthority && (
              <button
                onClick={() => {
                  showMint({
                    blueprintId: blueprint.id,
                  })
                }}
                className={cn(
                  'w-full md:w-fit',
                  'flex items-center justify-center gap-3',
                  'rounded pr-6 pl-4 py-3 text-lg text-center text-nowrap',
                  'border-2 border-transparent',
                  'bg-gray-600/50'
                )}
              >
                <FilePlus size={24} />
                Mint
              </button>
            )}
            {owner && (
              <Link
                to={'new-recipe'}
                className={cn(
                  'w-full md:w-fit',
                  'flex items-center justify-center gap-3',
                  'rounded pr-6 pl-4 py-3 text-lg text-center text-nowrap',
                  'border-2 border-amber-300/50',
                  'bg-gradient-to-t from-amber-800 to-yellow-800'
                )}
              >
                <Shapes className='flex-none' size={24} />
                Create Recipe
              </Link>
            )}
          </div>
        </div>
      </div>
      <BlueprintRecipes {...blueprint} />
    </>
  )
}

export function BlueprintPage() {
  const { blueprintId } = useParams()
  const wallet = useUserWallet()
  const reload = useSetAtom(blueprintAtom(blueprintId || ''))

  useEffect(() => {
    reload()
  }, [blueprintId, wallet])

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <CenterWrapper>
        <div className='min-h-[calc(100vh-4rem)]'>
          <Suspense fallback={null}>
            <Content />
          </Suspense>
        </div>
        <Footer />
      </CenterWrapper>
    </div>
  )
}
