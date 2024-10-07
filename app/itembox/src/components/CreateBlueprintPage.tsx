import cn from 'classnames'
import { Nav } from './Nav'
import {
  ArrowUDownLeft,
  Check,
  CheckCircle,
  CheckSquare,
  CircleNotch,
  FilePlus,
  HouseLine,
  PauseCircle,
  Play,
  RadioButton,
  Signature,
  Square,
} from '@phosphor-icons/react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { CenterWrapper } from './CenterWrapper'
import { useUserWallet } from '../atoms/userWalletAtom'
import { PublicKey } from '@solana/web3.js'
import { trimAddress } from '../utils/trimAddress'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { useAtom, useAtomValue } from 'jotai'
import { base64ToFile } from '../utils/base64ToFile'
import { Link } from 'react-router-dom'
import { createGenericFileFromBrowserFile } from '@metaplex-foundation/umi'
import { umiAtom } from '../atoms/umiAtom'
import { itemboxSdkAtom } from '../atoms/itemboxSdkAtom'
import { PageHeader } from './PageHeader'
import { PleaseConnect } from './PleaseConnect'

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

const defaultForm: BlueprintFormState = {
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

const blueprintFormAtom = atomFamily((id) =>
  atomWithStorage<BlueprintFormState>(
    `itembox_blueprint_form_${id}`,
    defaultForm
  )
)

function BlueprintForm() {
  const wallet = useUserWallet()
  const umi = useAtomValue(umiAtom)
  const itembox = useAtomValue(itemboxSdkAtom)
  const [state, setState] = useAtom(
    blueprintFormAtom(wallet?.publicKey?.toBase58() ?? '')
  )
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
  const [blueprint, setBlueprint] = useState('')

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

  const message = useMemo(() => {
    if (step === 0) return ''
    if (!busy) return 'Interrupted'
    if (step === 1) return 'Uploading Image'
    if (step === 2) return 'Uploading Metadata'
    if (step === 3) return 'Creating Blueprint'
  }, [step, busy])

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

  useEffect(() => {
    if (!blueprint) {
      setName(state.name)
      setDescription(state.description)
      setSelectedFile(state.file ? base64ToFile(state.file, name) : null)
      setSelectedImage(state.file)
      setNonfungible(state.nonFungible)
      setMintAuthority((s) => state.mintAuthority || s)
      setTreasury((s) => state.treasury || s)
    }
  }, [state, blueprint])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onSubmit = async () => {
    if (!itembox) return
    if (!selectedFile) return
    if (!selectedImage) return
    if (!name) return
    if (!description) return
    if (!trimmedMintAuthority) return
    if (!trimmedTreasury) return

    let form = {
      name,
      description,
      file: selectedImage,
      nonFungible,
      mintAuthority: mintAuthority,
      treasury: treasury,
      processing: true,
      image: state.image,
      metadata: state.metadata,
      blueprintAddress: state.blueprintAddress,
    }

    if (!state.processing) {
      setState(form)
    }

    setBusy(true)

    if (!form.image) {
      try {
        const file = selectedFile ?? base64ToFile(form.file, name)
        const umiImageFile = await createGenericFileFromBrowserFile(file)
        const [imgUri] = await umi.uploader.upload([umiImageFile])

        if (!imgUri) {
          throw Error('Missing image uri ' + imgUri)
        }

        form.image = imgUri
        setState((s) => ({ ...s, image: form.image }))
      } catch (e) {
        console.error(e)
        setBusy(false)
        return
      }
    }

    if (!form.metadata) {
      try {
        const uri = await umi.uploader.uploadJson({
          name,
          description: description,
          image: form.image,
        })

        form.metadata = uri
        setState((s) => ({ ...s, metadata: form.metadata }))
      } catch (e) {
        console.error(e)
        setBusy(false)
        return
      }
    }

    if (!form.blueprintAddress) {
      try {
        const result = await itembox.createBlueprint(
          form.nonFungible,
          form.name,
          form.metadata,
          new PublicKey(form.treasury),
          new PublicKey(form.mintAuthority)
        )

        form.blueprintAddress = result.blueprint.toBase58()
        setState((s) => ({
          ...s,
          blueprintAddress: form.blueprintAddress,
        }))
        console.log(result)
      } catch (e) {
        console.error(e)
        setBusy(false)
        return
      }
    }

    setBusy(false)
    setBlueprint(form.blueprintAddress)
    setState((s) => ({
      ...defaultForm,
      mintAuthority: s.mintAuthority,
      treasury: s.treasury,
    }))
  }

  return (
    <>
      <PageHeader>Create a new Blueprint</PageHeader>
      <div className='px-5 flex flex-col items-center'>
        <div
          className={cn(
            'flex-none',
            'rounded-lg bg-gray-700',
            'flex flex-col md:flex-row overflow-hidden'
          )}
        >
          <div className='flex-none'>
            <div className='min-h-80 w-full landscape:min-h-96 landscape:w-96 h-full bg-black/20 flex items-center justify-center'>
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
                  onChange={(e) => setName(e.target.value.substring(0, 32))}
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
                  <span className='tabular-nums'>
                    ({description.length}/1024)
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value.substring(0, 1024))
                  }
                  className={cn(
                    'flex items-center gap-3',
                    'rounded px-4 py-3 text-lg',
                    'bg-black/20 w-full'
                  )}
                  placeholder='Description of the asset. Supports markdown syntax.'
                  disabled={state.processing}
                />
              </div>
              <div>
                <button
                  className='flex items-center gap-3 pr-3'
                  onClick={() => setNonfungible((c) => !c)}
                  disabled={state.processing}
                >
                  {nonFungible ? (
                    <CheckSquare size={24} />
                  ) : (
                    <Square size={24} />
                  )}
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
      </div>
      <div className='flex flex-col items-center justify-between gap-5 p-5'>
        <div className='flex-none flex gap-2 text-gray-400 items-center justify-center relative'>
          {!blueprint &&
            [1, 2, 3].map((i) => {
              if (step < i) {
                return <RadioButton key={i} size={32} className='opacity-10' />
              }
              if (step === i) {
                return (
                  <Fragment key={i}>
                    {busy ? (
                      <CircleNotch
                        size={32}
                        className='opacity-50 animate-spin'
                      />
                    ) : (
                      <PauseCircle
                        size={32}
                        className='opacity-50 text-amber-400'
                      />
                    )}
                    {message}
                  </Fragment>
                )
              }
              return (
                <CheckCircle
                  key={i}
                  size={32}
                  className='opacity-100 text-green-400'
                />
              )
            })}
          {blueprint && (
            <div className='text-center flex items-center justify-center'>
              <Link
                to={`/blueprints/${blueprint}`}
                className='flex rounded px-3 py-1 bg-green-900/10 text-green-200'
              >
                Blueprint Created!
              </Link>
            </div>
          )}
        </div>
        {blueprint ? (
          <div className='flex-none mx-auto flex items-center gap-5 portrait:flex-col'>
            {wallet?.publicKey && (
              <Link
                to={`/user/${wallet.publicKey.toBase58()}`}
                className={cn(
                  'w-fit',
                  'flex items-center gap-3',
                  'rounded pr-6 pl-4 py-3 text-lg',
                  'border-2 border-transparent',
                  'bg-gray-600/50'
                )}
              >
                <HouseLine size={28} />
                Go Home
              </Link>
            )}
            <button
              onClick={() => {
                setBusy(false)
                setBlueprint('')
              }}
              className={cn(
                'w-fit',
                'flex items-center gap-3',
                'rounded pr-6 pl-4 py-3 text-lg',
                'border-2 border-transparent',
                'bg-gray-600/50'
              )}
            >
              <FilePlus size={24} />
              Create Another
            </button>
          </div>
        ) : (
          <div className='flex-none mx-auto flex items-center gap-5 portrait:flex-col'>
            {state.processing && !busy && (
              <button
                onClick={() => {
                  setBusy(false)
                  setState((s) => ({
                    ...defaultForm,
                    mintAuthority: s.mintAuthority,
                    treasury: s.treasury,
                  }))
                  setBlueprint('')
                }}
                className={cn(
                  'w-fit',
                  'flex items-center gap-3',
                  'rounded pr-6 pl-4 py-3 text-lg',
                  'border-2 border-transparent',
                  'bg-gray-600/50'
                )}
              >
                <ArrowUDownLeft size={24} />
                Start Over
              </button>
            )}
            <button
              onClick={onSubmit}
              className={cn(
                'w-fit',
                'flex items-center gap-3',
                'rounded pr-6 pl-4 py-3 text-lg',
                'bg-gradient-to-t',
                busy ? 'opacity-50 cursor-wait' : 'opacity-100 cursor-pointer',
                'border-2 border-amber-300/50',
                'from-amber-800 to-yellow-800'
              )}
              disabled={busy}
            >
              {state.processing && busy ? (
                <Signature size={24} />
              ) : (
                <Play size={24} />
              )}
              {state.processing
                ? busy
                  ? 'Please Sign'
                  : 'Resume Process'
                : 'Start Process'}
            </button>
          </div>
        )}
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
        {wallet?.publicKey ? <BlueprintForm /> : <PleaseConnect />}
      </CenterWrapper>
    </div>
  )
}
