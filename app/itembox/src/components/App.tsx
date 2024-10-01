import { Compass, FilePlus, GithubLogo } from '@phosphor-icons/react'
import cn from 'classnames'
import { BlueprintCard } from './BlueprintCard'
import { Nav } from './Nav'
import { Link } from 'react-router-dom'

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
                game assets more interoperable, allowing developers to easily
                share and integrate assets from each other&apos;s games
              </h2>
              <div className='flex gap-5 portrait:flex-col'>
                <Link
                  to={'/blueprints'}
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
                </Link>
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
        <Nav />
        <div className='w-full min-h-screen max-w-7xl mx-auto'>
          <div className='py-32 px-5 text-center flex items-center justify-center'>
            <h2 className='text-3xl tracking-wider'>Explore Blueprints</h2>
          </div>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-5'>
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
