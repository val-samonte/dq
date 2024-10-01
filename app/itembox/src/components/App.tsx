import { Compass, FilePlus, GithubLogo, Wallet } from '@phosphor-icons/react'
import cn from 'classnames'
import { BlueprintCard } from './BlueprintCard'

function App() {
  return (
    <div className='absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <div>
        <div className='h-screen flex flex-col flex-none bg-gradient-to-r from-gray-900 to-gray-800'>
          <div className='h-full w-full max-w-7xl mx-auto relative'>
            <button className='absolute left-0 top-5 md:top-[10vh]'>
              <img
                src='/logo.png'
                alt='Itembox'
                className='w-16 h-16 object-contain aspect-square'
              />
            </button>
            <div className='h-full w-full p-5 flex flex-col justify-center gap-10 pt-[20vh]'>
              <h2 className='text-3xl md:text-4xl w-full max-w-2xl'>
                <span className='font-bold tracking-wider'>Itembox</span> makes
                game assets interoperable, allowing developers to easily share
                and integrate assets from each other&apos;s games
              </h2>
              <div className='flex gap-5 portrait:flex-col'>
                <button
                  className={cn(
                    'w-fit',
                    'flex items-center gap-3',
                    'rounded pr-6 pl-4 py-3 text-lg',
                    'border-2 border-amber-300/50',
                    'bg-gradient-to-t from-purple-800 to-fuchsia-800'
                  )}
                >
                  <FilePlus size={24} />
                  Get Started
                </button>
                <button
                  className={cn(
                    'w-fit',
                    'flex items-center gap-3',
                    'rounded pr-6 pl-4 py-3 text-lg',
                    // 'border-2 border-white/10',
                    // 'bg-gradient-to-t from-purple-800 to-fuchsia-800'
                    'bg-gray-600/20'
                  )}
                >
                  <Compass size={24} />
                  Explore Blueprints
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={cn('bg-slate-800 w-full h-16 sticky top-0 z-10')}>
          <div className='px-5 w-full h-full max-w-7xl mx-auto flex items-center justify-between gap-5'>
            <div className='flex-auto'>
              <input
                className={cn(
                  'flex items-center gap-3',
                  'rounded px-6 py-3 text-lg',
                  // 'border-2 border-white/10',
                  'bg-black/20 w-full'
                )}
                type='text'
                placeholder='Search by address, author or Blueprints'
              />
            </div>
            <div className='flex-none'>
              <button
                className={cn(
                  'w-fit',
                  'flex items-center gap-3',
                  'rounded pr-4 md:pr-6 pl-4 py-3 text-lg',
                  // 'border-2 border-white/10',
                  'bg-gray-600/20'
                )}
              >
                <Wallet size={24} />
                <span className='hidden md:inline'>Connect Wallet</span>
              </button>
            </div>
          </div>
        </div>
        <div className='w-full min-h-screen max-w-7xl mx-auto'>
          <div className='py-32 px-5 text-center flex items-center justify-center'>
            <h2 className='text-3xl font-bold tracking-wider'>
              Explore Blueprints
            </h2>
          </div>
          <div className='grid grid-cols-4 gap-5 px-5'>
            <BlueprintCard />
            <BlueprintCard />
            <BlueprintCard />
            <BlueprintCard />
            <BlueprintCard />
            <BlueprintCard />
            <BlueprintCard />
          </div>
        </div>
        <footer className='w-full max-w-7xl mx-auto'>
          <div className='py-32 px-5 text-center flex items-center justify-center'>
            <button>
              <GithubLogo size={32} />
            </button>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
