import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { Dialogs, showDialogAtom } from '../atoms/showDialogAtom'
import Dialog from './Dialog'
import { useRef, useState } from 'react'
import cn from 'classnames'
import { GenderFemale, GenderMale } from '@phosphor-icons/react'
import { umiAtom } from '../atoms/umiAtom'
import { generateSigner } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
import { solBalanceAtom } from '../atoms/solBalanceAtom'
import { masterAddress } from '../constants/addresses'
import { newCharacterMintedAtom } from '../atoms/newCharacterMintedAtom'

const busyAtom = atom(false)

function Inner() {
  const showDialog = useSetAtom(showDialogAtom)
  const setNewMint = useSetAtom(newCharacterMintedAtom)
  const umi = useAtomValue(umiAtom)
  const balance = useAtomValue(solBalanceAtom)
  const [busy, setBusy] = useAtom(busyAtom)
  const [name, setName] = useState('')
  const [gender, setGender] = useState('male')
  const nameRef = useRef<HTMLInputElement | null>(null)

  const onCreate = async () => {
    if (!name) {
      nameRef.current?.focus()
      return
    }
    if ((balance ?? 0) < 0.0042) {
      showDialog(Dialogs.NOT_ENOUGH_BALANCE)
      return
    }
    setBusy(true)
    try {
      const uri = await umi.uploader.uploadJson({
        name,
        description: `DeezQuest ${
          gender === 'male' ? 'Male' : 'Female'
        } Character https://deez.quest`,
        image: `https://deez.quest/char_${gender}.png`,
      })

      const assetSigner = generateSigner(umi)
      await create(umi, {
        asset: assetSigner,
        name,
        uri,
        owner: umi.identity.publicKey,
        updateAuthority: masterAddress,
        plugins: [
          {
            type: 'PermanentFreezeDelegate',
            frozen: false,
            authority: { type: 'Address', address: masterAddress },
          },
          {
            type: 'PermanentBurnDelegate',
            authority: { type: 'Address', address: masterAddress },
          },
        ],
      }).sendAndConfirm(umi)

      setTimeout(() => {
        setBusy(false)
      }, 1000)

      setNewMint(assetSigner.publicKey)
    } catch (e) {
      showDialog(Dialogs.NOT_ENOUGH_BALANCE)
      console.log(e)

      setBusy(false)
    }
  }

  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='max-w-sm mx-auto w-full'>
        <div className='flex flex-col text-center gap-5'>
          <h1 className='font-serif text-center font-bold text-lg'>
            Character Creation
          </h1>
          <button
            disabled={busy}
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
                disabled={busy}
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
                disabled={busy}
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
              readOnly={busy}
              ref={nameRef}
              className='bg-stone-900 rounded px-10 py-2 text-center w-full'
              autoFocus
              type={'text'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Name your character'
            />
            <button
              onClick={onCreate}
              disabled={busy}
              className={cn(
                busy && 'opacity-50 cursor-wait',
                'px-3 py-2 bg-amber-100 rounded text-stone-800 flex items-center justify-center gap-2'
              )}
            >
              {busy ? 'Please Wait' : 'Create (Cost ~0.0042 SOL)'}
            </button>
          </div>
        </div>
      </div>
      <button
        className={cn(
          busy && 'opacity-50 cursor-wait',
          'text-center py-5 w-full'
        )}
        onClick={() => showDialog(Dialogs.NONE)}
        disabled={busy}
      >
        Cancel
      </button>
    </div>
  )
}

export function MintCharacterDialog() {
  const [currentDialog, showDialog] = useAtom(showDialogAtom)
  const busy = useAtomValue(busyAtom)

  return (
    <Dialog
      show={currentDialog === Dialogs.MINT_CHARACTER}
      onClose={() => !busy && showDialog(Dialogs.NONE)}
    >
      <Inner />
    </Dialog>
  )
}
