import { useAtomValue, useSetAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { solBalanceAtom } from '../atoms/solBalanceAtom'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { Suspense } from 'react'
import cn from 'classnames'
import { selectedCharacterAtom } from '../atoms/selectedCharacterAtom'

export function HomeScreen() {
  const selectedCharacter = useAtomValue(selectedCharacterAtom)
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
    <div className='w-full h-full flex flex-col overflow-y-auto overflow-x-hidden'>
      <div
        className='flex flex-col p-5 gap-5'
        style={{
          backgroundImage: 'url("/terrain.webp")',
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat-y',
        }}
      >
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
        {selectedCharacter && (
          <div className='aspect-square object-contain w-[60%] pointer-events-none' />
        )}
      </div>
      <Suspense fallback={null}>
        <CharacterPreview />
      </Suspense>
    </div>
  )
}

function CharacterPreview() {
  const selectedCharacter = useAtomValue(selectedCharacterAtom)
  if (!selectedCharacter) return null

  return (
    <Link
      to={'/barracks'}
      className={cn(
        'animate-fade-in',
        'absolute bottom-0 inset-x-0 mt-auto',
        'bg-gradient-to-t from-sky-100 to-white/0',
        'flex items-end'
      )}
    >
      <div className='flex flex-col flex-auto items-end py-5 gap-5'>
        <div className='flex gap-5 relative px-5'>
          <div
            className={cn(
              'overflow-hidden w-16 h-16',
              'border border-stone-800',
              'flex flex-col items-center justify-center p-3',
              'aspect-square object-contain rounded bg-stone-950'
            )}
          >
            <span className='text-[0.5em] text-center font-bold uppercase opacity-20'>
              No Weapon
            </span>
          </div>
          <div
            className={cn(
              'overflow-hidden w-16 h-16',
              'border border-stone-800',
              'flex flex-col items-center justify-center p-3',
              'aspect-square object-contain rounded bg-stone-950'
            )}
          >
            <span className='text-[0.5em] text-center font-bold uppercase opacity-20'>
              No Armor
            </span>
          </div>
        </div>
        <div
          className={cn(
            'relative',
            'whitespace-nowrap font-serif',
            'flex items-center justify-center',
            'pointer-events-none select-none',
            'px-3 py-2 bg-gradient-to-r w-full',
            'border-y-2',
            'border-amber-300/80',
            'from-black/10 to-black'
          )}
        >
          <span className='w-[50%]' />
          <span className='w-[50%] text-center'>
            {selectedCharacter.details?.name}
          </span>
        </div>
      </div>
      <img
        src={selectedCharacter.details?.image}
        alt={selectedCharacter.details?.name}
        className='absolute bottom-0 left-0 aspect-square object-contain w-[60%] -ml-[10%]'
      />
    </Link>
  )
}
