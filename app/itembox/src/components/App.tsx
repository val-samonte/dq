import { Compass, FilePlus } from '@phosphor-icons/react'
import cn from 'classnames'
import { Nav } from './Nav'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { AllBlueprints } from './AllBlueprints'
import { Footer } from './Footer'

function App() {
  const dummy = useRef<HTMLDivElement>(null)

  return (
    <div className='absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <div>
        <div className='h-screen flex flex-col flex-none bg-gradient-to-r from-gray-800 to-gray-700'>
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
                    'bg-gradient-to-t from-amber-800 to-yellow-800'
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
                    'bg-gray-600/50'
                  )}
                  onClick={() => {
                    if (dummy.current) {
                      dummy.current.scrollIntoView({ behavior: 'smooth' })
                    }
                  }}
                >
                  <Compass size={24} />
                  Explore Blueprints
                </button>
              </div>
            </div>
          </div>
        </div>
        <div ref={dummy} />
        <Nav />
        <AllBlueprints />
        <Footer />
      </div>
    </div>
  )
}

export default App
