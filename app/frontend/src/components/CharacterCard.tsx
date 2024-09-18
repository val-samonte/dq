import { Suspense, useMemo } from 'react'
import { characterUriDetailsAtom } from '../atoms/characterUriDetailsAtom'
import { useAtom, useAtomValue } from 'jotai'
import cn from 'classnames'
import { selectedCharacterAddressAtom } from '../atoms/selectedCharacterAtom'
import { publicKey } from '@metaplex-foundation/umi'

interface CharacterCardProps {
  uri: string
  name: string
  publicKey: string
}

function Inner({ uri, publicKey: pubkey }: CharacterCardProps) {
  const [selected, selectCharacter] = useAtom(selectedCharacterAddressAtom)
  const characterDetails = useAtomValue(characterUriDetailsAtom(uri))

  const isSelected = useMemo(() => {
    return publicKey(pubkey) === selected
  }, [selected, pubkey])

  if (!characterDetails) return null

  return (
    <button
      onClick={() => selectCharacter(pubkey)}
      className={cn(
        isSelected
          ? 'border-amber-300 bg-stone-800'
          : 'bg-stone-900 border-stone-800',
        'transition-all',
        'border rounded-xl relative overflow-hidden text-left',
        'flex flex-col justify-center p-3 gap-2',
        'transition-all duration-300 hover:scale-[1.025]'
      )}
    >
      <div className='w-full flex gap-3 justify-between'>
        <div className='flex gap-3 flex-auto'>
          <img
            src={characterDetails.image}
            alt={characterDetails.name}
            className='flex-none aspect-square object-contain w-16 h-16 rounded'
          />
          <div className='flex-auto flex flex-col gap-2 justify-center'>
            <div className='font-serif text-amber-100'>
              {characterDetails.name}
            </div>
            <div className='text-xs'>
              <span>HP 100 / </span>
              <span>MP 12</span>
            </div>
          </div>
        </div>
        <div className='flex gap-3 h-16 relative w-20 sm:w-auto'>
          <div
            className={cn(
              'overflow-hidden',
              'absolute top-0 left-0 h-12',
              'sm:relative sm:h-full',
              'border border-stone-800',
              'flex-auto flex flex-col items-center justify-center p-3',
              'aspect-square object-contain rounded bg-stone-950'
            )}
          >
            <span className='text-[0.5em] text-center font-bold uppercase opacity-20'>
              No Weapon
            </span>
          </div>
          <div
            className={cn(
              'overflow-hidden',
              'absolute bottom-0 right-0 h-12',
              'sm:relative sm:h-full',
              'border border-stone-800',
              'flex-auto flex flex-col items-center justify-center p-3',
              'aspect-square object-contain h-full rounded bg-stone-950'
            )}
          >
            <span className='text-[0.5em] text-center font-bold uppercase opacity-20'>
              No Armor
            </span>
          </div>
        </div>
      </div>
    </button>
  )
}

export function CharacterCard(props: CharacterCardProps) {
  return (
    <Suspense fallback={null}>
      <Inner {...props} />
    </Suspense>
  )
}
