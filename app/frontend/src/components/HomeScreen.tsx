import { useAtomValue, useSetAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { solBalanceAtom } from '../atoms/solBalanceAtom'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'

export function HomeScreen() {
  const balance = useAtomValue(solBalanceAtom)
  const insufficientArena = (balance ?? 0) < 0.01
  const showDialog = useSetAtom(showDialogAtom)

  // arena: check balance, check character, check pvp PDA
  const handleArenaNavigation = () => {
    if (insufficientArena) {
      showDialog(Dialogs.NOT_ENOUGH_BALANCE)
      return
    }
  }

  return (
    <div className='w-full h-full flex flex-col p-5 gap-5 overflow-x-auto'>
      <Link
        to={'/tutorial'}
        className='flex-none h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
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
        className='flex-none h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
        style={{
          backgroundImage: 'url("/target_dummy.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Practice
        </span>
      </Link>
      <Link
        to={'/tavern'}
        className='flex-none h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
        style={{
          backgroundImage: 'url("/bg_bar.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 35%',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Tavern
        </span>
      </Link>
      <button
        onClick={handleArenaNavigation}
        className='flex-none w-full h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
        style={{
          backgroundImage: 'url("/bg_ruins.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Arena
        </span>
      </button>
      <Link
        to={'/barracks'}
        className='flex-none w-full h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
        style={{
          backgroundImage: 'url("/bg_barracks.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Barracks
        </span>
      </Link>
    </div>
  )
}
