import { useSetAtom } from 'jotai'
import { Link } from 'react-router-dom'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import { InputStage } from './InputStage'

export function Tavern() {
  const showDialog = useSetAtom(showDialogAtom)
  const onHire = () => {
    showDialog(Dialogs.MINT_CHARACTER)
  }

  return (
    <div className='flex-auto h-full w-full flex flex-col'>
      <div
        className='flex-auto flex flex-col relative'
        style={{
          backgroundImage: 'url("/bg_bar.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <img
          src='/npc_gabranth.png'
          alt='Gabranth'
          className='h-[90%] aspect-square absolute -right-5 bottom-0'
        />
        <div className='flex flex-col gap-2 absolute border-l border-amber-300 px-5 py-3 m-5 bottom-0 inset-x-0 bg-gradient-to-r from-black/80 via-black/80 to-black/10'>
          <p className='font-serif text-amber-100'>Gabranth</p>
          <p className='text-sm'>
            Need a drink, a room, or perhaps an extra sword arm for the road?
            Plenty of fine folk pass through here looking for a bit of
            adventure.
          </p>
        </div>
      </div>
      <InputStage>
        <button
          onClick={onHire}
          className='text-left bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden flex flex-col justify-center border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
        >
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>
              &ldquo;I am looking to hire someone. I heard you know where to
              find good help.&rdquo;
            </p>
          </div>
        </button>
        <Link
          to={'/'}
          className='bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden flex flex-col justify-center border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
        >
          <div className='flex flex-col gap-2'>
            <p className='text-sm'>
              &ldquo;Thank you, Gabranth. Nothing I need anymore.
              Farewell.&rdquo;
            </p>
          </div>
        </Link>
      </InputStage>
    </div>
  )
}
