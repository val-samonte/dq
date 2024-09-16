import { useAtom, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { useState } from 'react'
import cn from 'classnames'
import { GenderFemale, GenderMale } from '@phosphor-icons/react'

function Inner() {
  const showDialog = useSetAtom(showDialogAtom)
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='max-w-sm mx-auto w-full'>
        <div className='flex flex-col text-center gap-5'>
          <h1 className='font-serif text-center font-bold text-lg'>
            Character Creation
          </h1>
          <button
            className='w-full'
            onClick={() => setGender(gender === 'male' ? 'female' : 'male')}
          >
            <div className='mx-auto w-[80%] aspect-square relative'>
              <img
                src='/char_male.png'
                alt='Male Adventurer'
                className={cn(
                  'transition-all ease-back duration-500',
                  gender === 'male'
                    ? 'z-30 brightness-100 grayscale-0 translate-x-0 delay-100'
                    : 'z-20 brightness-50 grayscale -translate-x-10',
                  'absolute -left-[10%] bottom-0',
                  'w-full aspect-square object-contain'
                )}
              />
              <img
                src='/char_female.png'
                alt='Female Adventurer'
                className={cn(
                  'transition-all ease-back duration-500',
                  gender === 'female'
                    ? 'z-30 brightness-100 grayscale-0 translate-x-0 delay-100'
                    : 'z-20 brightness-50 grayscale translate-x-10',
                  'absolute -right-[10%] bottom-0',
                  '-scale-x-100',
                  'w-[90%] aspect-square object-contain'
                )}
              />
            </div>
          </button>
          <div className='flex flex-col gap-5 px-5'>
            <div className='flex gap-2'>
              <button
                onClick={() => setGender('male')}
                className={cn(
                  'flex items-center gap-2 justify-center',
                  'flex-auto px-3 py-2 font-serif transition-all',
                  gender === 'male' ? 'opacity-100' : 'opacity-50'
                )}
              >
                <GenderMale size={20} /> Male
              </button>
              <button
                onClick={() => setGender('female')}
                className={cn(
                  'flex items-center gap-2 justify-center',
                  'flex-auto px-3 py-2 font-serif transition-all',
                  gender === 'female' ? 'opacity-100' : 'opacity-50'
                )}
              >
                <GenderFemale size={20} />
                Female
              </button>
            </div>
            <input
              className='bg-stone-900 rounded px-10 py-2 text-center w-full'
              autoFocus
              type={'text'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Name your character'
            />
            <button className='px-3 py-2 bg-amber-100 rounded text-stone-800 flex items-center justify-center gap-2'>
              Hire (Cost 0.003 SOL)
            </button>
          </div>
        </div>
      </div>
      <button
        className='text-center py-5 w-full'
        onClick={() => showDialog(Dialogs.NONE)}
      >
        Cancel
      </button>
    </div>
  )
}

export function MintCharacterDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.MINT_CHARACTER}
      onClose={() => showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
