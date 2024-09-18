import { useAtom, useSetAtom } from 'jotai'
import Dialog from './Dialog'
import { newCharacterMintedAtom } from '../atoms/newCharacterMintedAtom'
import { useEffect, useRef } from 'react'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'

const adventurerResponses = [
  'Glad to be part of the team! I’ve heard great things about your past adventures. Let’s make this one even better!',
  'Happy to join your ranks! With our combined skills, we’ll tackle any challenge that comes our way.',
  'Looking forward to the journey with you all. I’m sure we’ll have plenty of stories to share by the time we’re done.',
  "It's an honor to join your party. I won’t let you down, and I’m eager to prove my worth in battle.",
  'Excited to see where this adventure takes us! Together, there’s no foe too strong and no treasure too far.',
]

function Inner() {
  const [newMint, setNewMint] = useAtom(newCharacterMintedAtom)
  const prevMint = useRef(newMint)
  const pickMessage = useRef(Date.now() % adventurerResponses.length)

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='px-5 rounded-xl max-w-sm mx-auto w-full'>
        <div className='flex flex-col text-center gap-5'>
          <h1 className='font-serif text-center font-bold text-lg'>
            {prevMint.current?.details?.name} joined the party!
          </h1>
          <div className='flex flex-col text-center gap-2'>
            <img
              src={prevMint.current?.details?.image}
              alt={prevMint.current?.details?.name}
              className='w-full aspect-square'
            />
            <div className='text-left flex flex-col gap-2 border-l border-amber-300 px-5 py-3 bg-gradient-to-r from-black/80 via-black/80 to-black/10'>
              <p className='font-serif text-amber-100'>
                {prevMint.current?.details?.name}
              </p>
              <p className='text-sm'>
                {adventurerResponses[pickMessage.current]}
              </p>
            </div>
          </div>
        </div>
      </div>
      <button
        className='text-center py-5 w-full'
        onClick={() => setNewMint(null)}
      >
        Close
      </button>
    </div>
  )
}

export function NewCharacterDialog() {
  const showDialog = useSetAtom(showDialogAtom)
  const [newMint, setNewMint] = useAtom(newCharacterMintedAtom)

  useEffect(() => {
    if (!!newMint) {
      showDialog(Dialogs.NONE)
    }
  }, [newMint, showDialog])

  return (
    <Dialog show={!!newMint} onClose={() => setNewMint(null)}>
      <Inner />
    </Dialog>
  )
}
