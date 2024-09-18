import { Link } from 'react-router-dom'
import { InputStage } from './InputStage'
import { Suspense, useMemo } from 'react'
import { CharacterList } from './CharacterList'
import { useAtomValue } from 'jotai'
import { selectedCharacterAtom } from '../atoms/selectedCharacterAtom'

const adventurerResponses = [
  'Where to next?',
  'Hello there, excited for the adventure ahead!',
  'Ready when you are. Let’s get moving!',
  "So, what's our first destination?",
  'Glad to be here! Let’s make this journey one to remember.',
  'I’m all set. Where do we begin?',
  'Lead the way, I’ll follow!',
  'I’ve got your back. Let’s get this started!',
  'What’s the plan? I’m eager to get going.',
  "Adventure awaits! Let's not waste any time.",
]

function CharacterPreview() {
  const selectedCharacter = useAtomValue(selectedCharacterAtom)
  const message = useMemo(() => {
    return adventurerResponses[Date.now() % adventurerResponses.length]
  }, [selectedCharacter])

  if (!selectedCharacter?.details) return null

  return (
    <>
      <img
        src={selectedCharacter.details.image}
        alt={selectedCharacter.details.name}
        className='animate-slide-fade-in-left h-[90%] aspect-square absolute left-0 bottom-0'
      />
      <div className='flex flex-col gap-2 absolute border-l border-amber-300 px-5 py-3 m-5 bottom-0 inset-x-0 bg-gradient-to-r from-black/80 via-black/80 to-black/10'>
        <p className='font-serif text-amber-100'>
          {selectedCharacter.details.name}
        </p>
        <p className='text-sm w-[80%]'>{message}</p>
      </div>
    </>
  )
}

export function Barracks() {
  return (
    <div className='flex-auto h-full w-full flex flex-col'>
      <div
        className='flex-auto flex flex-col relative'
        style={{
          backgroundImage: 'url("/bg_barracks.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Suspense fallback={null}>
          <CharacterPreview />
        </Suspense>
      </div>
      <InputStage>
        <Suspense fallback={null}>
          <CharacterList>
            <Link
              to={'/'}
              className='bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden flex flex-col justify-center border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
            >
              <div className='flex flex-col gap-2'>
                <p className='text-sm'>
                  &ldquo;No one’s here… Let’s head to the tavern and see if we
                  can find someone to join our adventure.&rdquo;
                </p>
              </div>
            </Link>
          </CharacterList>
        </Suspense>
      </InputStage>
    </div>
  )
}
