import { Link } from 'react-router-dom'

export function HomeScreen() {
  return (
    <div className='w-full h-full flex flex-col p-5 gap-5'>
      <Link
        to={'/tutorial'}
        className='h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-105'
        style={{
          backgroundImage: 'url("/bg_library.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Tutorial
        </span>
      </Link>
      <Link
        to={'/practice'}
        className='h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-105'
        style={{
          backgroundImage: 'url("/target_dummy.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Practice
        </span>
      </Link>
      <Link
        to={'/challenge'}
        className='h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-105'
        style={{
          backgroundImage: 'url("/bg_ruins.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Challenge
        </span>
      </Link>
    </div>
  )
}
