import cn from 'classnames'
import { Nav } from './Nav'
import {
  Check,
  CheckCircle,
  CheckSquare,
  CircleNotch,
  Play,
  RadioButton,
  Smiley,
  Square,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CenterWrapper } from './CenterWrapper'
import { useUserWallet } from '../atoms/userWalletAtom'
import { PublicKey } from '@solana/web3.js'
import { trimAddress } from '../utils/trimAddress'
import { atomWithStorage } from 'jotai/utils'
import { useAtom } from 'jotai'
import { base64ToFile } from '../utils/base64ToFile'

interface BlueprintFormState {
  name: string
  description: string
  file: string
  nonFungible: boolean
  mintAuthority: string
  treasury: string
  processing: boolean
  image: string
  metadata: string
  blueprintAddress: string
}

const formDefault: BlueprintFormState = {
  name: '',
  description: '',
  file: '',
  nonFungible: true,
  mintAuthority: '',
  treasury: '',
  processing: false,
  image: '',
  metadata: '',
  blueprintAddress: '',
}

const blueprintFormAtom = atomWithStorage<BlueprintFormState>(
  'itembox_blueprint_form',
  formDefault
)

function BlueprintForm() {
  const wallet = useUserWallet()
  const [state, setState] = useAtom(blueprintFormAtom)
  const [name, setName] = useState(state.name)
  const [description, setDescription] = useState(state.description)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(
    state.file ? base64ToFile(state.file, name) : null
  )
  const [selectedImage, setSelectedImage] = useState<string | null>(state.file)
  const [nonFungible, setNonfungible] = useState(state.nonFungible)
  const [mintAuthority, setMintAuthority] = useState(state.mintAuthority)
  const [treasury, setTreasury] = useState(state.treasury)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (wallet?.publicKey) {
      const userAddress = wallet.publicKey.toBase58()
      setMintAuthority((v) => v || userAddress)
      setTreasury((v) => v || userAddress)
    }
  }, [wallet])

  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    } else {
      setSelectedImage(null)
    }
  }, [selectedFile])

  const trimmedMintAuthority = useMemo(() => {
    try {
      const parsed = new PublicKey(mintAuthority)
      return `(${trimAddress(parsed.toBase58())})`
    } catch (e) {}
    return ''
  }, [mintAuthority])

  const trimmedTreasury = useMemo(() => {
    try {
      const parsed = new PublicKey(treasury)
      return `(${trimAddress(parsed.toBase58())})`
    } catch (e) {}
    return ''
  }, [treasury])

  const step = useMemo(() => {
    if (!state.processing) return 0
    if (!state.image) return 1
    if (!state.metadata) return 2
    if (!state.blueprintAddress) return 3
    return 4
  }, [state])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }
  }

  const onSubmit = async () => {
    if (!selectedFile) return
    if (!selectedImage) return
    if (!name) return
    if (!description) return
    if (!trimmedMintAuthority) return
    if (!trimmedTreasury) return

    if (!state.processing) {
      setState({
        name,
        description,
        file: selectedImage,
        nonFungible: true,
        mintAuthority: state.mintAuthority,
        treasury: state.treasury,
        processing: true,
        image: '',
        metadata: '',
        blueprintAddress: '',
      })
    }

    setBusy(true)
  }

  return (
    <>
      <h2 className='text-3xl tracking-wider text-center pt-5'>
        Create a new Blueprint
      </h2>
      <div
        className={cn(
          'rounded-lg bg-gray-700',
          '',
          'flex flex-col md:flex-row overflow-hidden'
        )}
      >
        <div className='flex-none'>
          <div className='min-h-80 w-80 landscape:min-h-96 landscape:w-96 h-full bg-black/20 flex items-center justify-center'>
            <button
              className='w-full aspect-square p-5'
              onClick={() => {
                fileInputRef.current?.click()
              }}
              disabled={state.processing}
            >
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt='Selected Image'
                  className='w-full aspect-square object-contain'
                />
              ) : (
                'Select Image'
              )}
            </button>
            <input
              type='file'
              ref={fileInputRef}
              accept='image/jpeg, image/png, image/webp'
              onChange={handleFileChange}
              className='hidden'
              disabled={state.processing}
            />
          </div>
        </div>
        <div className='flex-none'>
          <div className='min-w-80 landscape:min-w-96 w-full flex flex-col gap-5 p-5'>
            <div className='flex flex-col gap-2'>
              <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center justify-between'>
                <span>Asset Name</span>
                <span className='tabular-nums'>({name.length}/32)</span>
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value.substring(0, 60))}
                className={cn(
                  'flex items-center gap-3',
                  'rounded px-4 py-3 text-lg',
                  'bg-black/20 w-full'
                )}
                type='text'
                placeholder='Name'
                disabled={state.processing}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center justify-between'>
                <span>Asset Description</span>
                <span className='tabular-nums'>({description.length}/256)</span>
              </label>
              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value.substring(0, 256))
                }
                className={cn(
                  'flex items-center gap-3',
                  'rounded px-4 py-3 text-lg',
                  'bg-black/20 w-full'
                )}
                placeholder='Description'
                disabled={state.processing}
              />
            </div>
            <div>
              <button
                className='flex items-center gap-3 pr-3'
                onClick={() => setNonfungible((c) => !c)}
                disabled={state.processing}
              >
                {nonFungible ? <CheckSquare size={24} /> : <Square size={24} />}
                <span>Non-Fungible</span>
              </button>
            </div>
            <div className='flex flex-col gap-2'>
              <label className='px-1 text-xs tracking-wider opacity-50 flex items-center justify-between'>
                <span className='uppercase'>Mint Authority</span>
                {trimmedMintAuthority && (
                  <span className='flex items-center gap-1'>
                    {trimmedMintAuthority} <Check size={12} />
                  </span>
                )}
              </label>
              <input
                value={mintAuthority}
                onChange={(e) => setMintAuthority(e.target.value)}
                onFocus={(e) => e.target.select()}
                className={cn(
                  'flex items-center gap-3',
                  'rounded px-4 py-3 text-lg',
                  'bg-black/20 w-full'
                )}
                type='text'
                placeholder='Mint Authority'
                disabled={state.processing}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <label className='px-1 text-xs tracking-wider opacity-50 flex items-center justify-between'>
                <span className='uppercase'>Treasury</span>
                {trimmedTreasury && (
                  <span className='flex items-center gap-1'>
                    {trimmedTreasury} <Check size={12} />
                  </span>
                )}
              </label>
              <input
                value={treasury}
                onChange={(e) => setTreasury(e.target.value)}
                onFocus={(e) => e.target.select()}
                className={cn(
                  'flex items-center gap-3',
                  'rounded px-4 py-3 text-lg',
                  'bg-black/20 w-full'
                )}
                type='text'
                placeholder='Treasury'
                disabled={state.processing}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center justify-between gap-10'>
        <div className='flex-none flex gap-2 text-gray-400 items-center'>
          <CheckCircle size={32} className='opacity-100' />
          <CircleNotch size={32} className='opacity-10 animate-spin' />
          <span>Uploading Metadata</span>
          <RadioButton size={32} className='opacity-10' />
        </div>
        <div className='flex-none mx-auto'>
          <button
            onClick={onSubmit}
            className={cn(
              'w-full',
              'flex items-center gap-3',
              'rounded pr-6 pl-4 py-3 text-lg',
              'bg-gradient-to-t',
              busy ? 'opacity-50 cursor-wait' : 'opacity-100 cursor-pointer',
              'border-2 border-amber-300/50',
              'from-amber-800 to-yellow-800'
            )}
            disabled={busy}
          >
            <Play size={24} />
            {state.processing
              ? busy
                ? 'Please Sign'
                : 'Resume Process'
              : 'Start Process'}
          </button>
        </div>
      </div>
    </>
  )
}

export function CreateBlueprintPage() {
  const wallet = useUserWallet()

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <CenterWrapper>
        {wallet?.publicKey ? (
          <BlueprintForm />
        ) : (
          <div className='flex flex-col gap-5 items-center justify-center text-center'>
            <Smiley size={32} />
            <div>Please connect your wallet to continue</div>
          </div>
        )}
      </CenterWrapper>
    </div>
  )
}
