import { Shapes, Sword } from '@phosphor-icons/react'
import { Link } from 'react-router-dom'

export function Tutorial() {
  return (
    <div className='flex-auto h-full w-full flex flex-col'>
      <div
        className='flex-auto flex flex-col relative'
        style={{
          backgroundImage: 'url("/bg_library.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <img
          src='/npc_monique.png'
          alt='Monique'
          className='h-[90%] aspect-square absolute -right-5 bottom-0'
        />
        <div className='flex flex-col gap-2 absolute border-l border-amber-300 px-5 py-3 m-5 bottom-0 inset-x-0 bg-gradient-to-r from-black/80 via-black/80 to-black/10'>
          <p className='font-serif text-amber-100'>Monique</p>
          <p className='text-sm'>
            Hello Adventurer! My name is Monique. <br />
            How can I help you today?
          </p>
        </div>
      </div>
      <div className='relative flex-none grid grid-cols-12 max-h-[50%]'>
        <div className='col-span-7 h-full pointer-events-none opacity-0'>
          <div className='aspect-[3/4] h-full pointer-events-none' />
        </div>
        <div className='absolute inset-0 flex flex-col p-5 gap-5 justify-center'>
          <Link
            to={'/tutorial/basics'}
            className='bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden flex flex-col justify-center border border-stone-800 transition-all duration-300 hover:scale-105'
          >
            <div className='flex flex-col gap-2'>
              <h3 className='font-serif text-amber-100 flex items-center gap-2'>
                <Shapes size={20} />
                <span>Basics</span>
              </h3>
              <p className='text-sm'>
                Learn the fundamentals to control the Elements, allowing you to
                execute commands.
              </p>
            </div>
          </Link>
          <Link
            to={'/tutorial/battle'}
            className='bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden flex flex-col justify-center border border-stone-800 transition-all duration-300 hover:scale-105'
          >
            <div className='flex flex-col gap-2'>
              <h3 className='font-serif text-amber-100 flex items-center gap-2'>
                <Sword size={20} />
                <span>Battle</span>
              </h3>
              <p className='text-sm'>
                Learn how to use the Elements to your advantage to defeat your
                enemies and win the fight.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
