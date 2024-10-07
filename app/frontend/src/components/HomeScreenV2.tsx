import { useAtomValue, useSetAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { solBalanceAtom } from '../atoms/solBalanceAtom'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { Suspense } from 'react'
import cn from 'classnames'
import { selectedCharacterAtom } from '../atoms/selectedCharacterAtom'

export function HomeScreenV2() {
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
        className='flex flex-col py-10'
        style={{
          backgroundImage: 'url("/terrain.webp")',
          backgroundSize: 'cover',
          backgroundRepeat: 'repeat-y',
        }}
      >
        <button
          onClick={handleArenaNavigation}
          className='w-full aspect-[2/1] overflow-visible relative'
        >
          <div className='absolute inset-0 pointer-events-none'>
            <img
              src='/buildings/arena.png'
              className='w-full h-full object-cover scale-125'
              alt='Arena'
            />
            <div className='absolute inset-0 flex items-center justify-center'>
              <h2
                className={cn(
                  'text-2xl font-serif',
                  'px-12 py-3 bg-gradient-to-r from-black/20 via-black/80 to-black/20',
                  'border-y border-amber-300 w-full'
                )}
              >
                Arena
              </h2>
            </div>
          </div>
        </button>
        <Link
          to={'/tutorial'}
          className='w-full aspect-[2/1] overflow-visible relative'
        >
          <div className='absolute inset-0 grid grid-cols-2 pointer-events-none'>
            <div className='relative scale-[1.5] z-[2]'>
              <img
                src='/buildings/trees3.png'
                className='w-full h-full object-contain absolute inset-0 -translate-y-[10%]'
                alt='Trees'
              />
              <img
                src='/buildings/library.png'
                className='w-full h-full object-contain absolute inset-0 scale-125 hover:scale-110 transition-all'
                alt='Library'
              />
              <img
                src='/buildings/bush1.png'
                className='w-full h-full object-contain absolute inset-0'
                alt='Bush'
              />
            </div>
            <div className='relative scale-[1.5]'>
              <img
                src='/buildings/right1.png'
                className='w-full h-full object-contain absolute inset-0 translate-x-[20%]'
                alt='Trees'
              />
            </div>
            <div className='absolute inset-0 flex items-center justify-center z-[1]'>
              <h2
                className={cn(
                  'text-2xl font-serif',
                  'px-12 py-3 bg-gradient-to-l from-black/80 to-black/20',
                  'border-y border-amber-300',
                  'absolute right-0 w-full text-right'
                )}
              >
                Library
              </h2>
            </div>
          </div>
        </Link>
        <Link
          to={'/practice'}
          className='w-full aspect-[2/1] overflow-visible relative'
        >
          <div className='absolute inset-0 grid grid-cols-2 pointer-events-none'>
            <div className='relative scale-[1.5]'>
              <img
                src='/buildings/left1.png'
                className='w-full h-full object-contain absolute inset-0 -translate-x-[20%]'
                alt='Trees'
              />
            </div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <h2
                className={cn(
                  'text-2xl font-serif',
                  'px-12 py-3 bg-gradient-to-r from-black/80 to-black/20',
                  'border-y border-amber-300',
                  'absolute left-0 w-full'
                )}
              >
                Practice
              </h2>
            </div>
            <div className='relative scale-[1.5]'>
              <img
                src='/buildings/trees1.png'
                className='w-full h-full object-contain absolute inset-0 -translate-y-[20%]'
                alt='Trees'
              />
              <img
                src='/buildings/practice.png'
                className='w-full h-full object-contain absolute inset-0 scale-125'
                alt='Practice'
              />
              <img
                src='/buildings/bush2.png'
                className='w-full h-full object-contain absolute inset-0'
                alt='Bush'
              />
            </div>
          </div>
        </Link>
        <Link
          to={'/tavern'}
          className='w-full aspect-[2/1] overflow-visible relative'
        >
          <div className='absolute inset-0 grid grid-cols-2 pointer-events-none'>
            <div className='relative scale-[1.5] z-[2]'>
              <img
                src='/buildings/trees2.png'
                className='w-full h-full object-contain absolute inset-0 -translate-y-[10%]'
                alt='Trees'
              />
              <img
                src='/buildings/tavern.png'
                className='w-full h-full object-contain absolute inset-0 scale-125'
                alt='Tavern'
              />
              <img
                src='/buildings/bush3.png'
                className='w-full h-full object-contain absolute inset-0'
                alt='Bush'
              />
            </div>
            <div className='absolute inset-0 flex items-center justify-center z-[1]'>
              <h2
                className={cn(
                  'text-2xl font-serif',
                  'px-12 py-3 bg-gradient-to-l from-black/80 to-black/20',
                  'border-y border-amber-300',
                  'absolute right-0 w-full text-right'
                )}
              >
                Tavern
              </h2>
            </div>
            <div className='relative scale-[1.5]'>
              <img
                src='/buildings/right2.png'
                className='w-full h-full object-contain absolute inset-0 translate-x-[20%]'
                alt='Trees'
              />
            </div>
          </div>
        </Link>
        <Link
          to={'/barracks'}
          className='w-full aspect-[2/1] overflow-visible relative'
        >
          <div className='absolute inset-0 grid grid-cols-2 pointer-events-none'>
            <div className='relative scale-[1.5]'>
              <img
                src='/buildings/left2.png'
                className='w-full h-full object-contain absolute inset-0 -translate-x-[20%]'
                alt='Trees'
              />
            </div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <h2
                className={cn(
                  'text-2xl font-serif',
                  'px-12 py-3 bg-gradient-to-r from-black/80 to-black/20',
                  'border-y border-amber-300',
                  'absolute left-0 w-full'
                )}
              >
                Barracks
              </h2>
            </div>
            <div className='relative scale-[1.5]'>
              <img
                src='/buildings/trees3.png'
                className='w-full h-full object-contain absolute inset-0 -translate-y-[20%]'
                alt='Trees'
              />
              <img
                src='/buildings/barracks.png'
                className='w-full h-full object-contain absolute inset-0 scale-125'
                alt='Barracks'
              />
              <img
                src='/buildings/bush3.png'
                className='w-full h-full object-contain absolute inset-0'
                alt='Bush'
              />
            </div>
          </div>
        </Link>
        <div className='aspect-[2/1] w-full pointer-events-none' />
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
        'flex items-end z-[3]'
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
