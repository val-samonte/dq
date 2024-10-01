import { Compass, FilePlus } from '@phosphor-icons/react'
import cn from 'classnames'

function App() {
  return (
    <div className='absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <div>
        <div className='h-screen flex flex-col flex-none bg-gradient-to-r from-gray-900 to-gray-800'>
          <div className='h-full w-full max-w-7xl mx-auto relative'>
            <button className='absolute left-0 top-[10vh]'>
              <img
                src='/logo.png'
                alt='Itembox'
                className='w-16 h-16 object-contain aspect-square'
              />
            </button>
            <div className='h-full w-full p-5 flex flex-col justify-center gap-10 mt-[5vh]'>
              <h2 className='text-2xl md:text-4xl w-full max-w-2xl'>
                <span className='font-bold tracking-wider'>Itembox</span> makes
                game assets truly interoperable, allowing developers to easily
                share and integrate assets from each other&apos;s games
              </h2>
              <div className='flex gap-5 portrait:flex-col'>
                <button
                  className={cn(
                    'flex items-center gap-3',
                    'rounded pr-6 pl-4 py-3 text-lg',
                    'border-2 border-white/10',
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
                    'border-2 border-white/10',
                    'bg-gradient-to-t from-purple-800 to-fuchsia-800'
                  )}
                >
                  <Compass size={24} />
                  Explore Blueprints
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='bg-slate-800 w-full h-16'></div>
      </div>
    </div>
  )
}

export default App
