import { useParams } from 'react-router-dom'
import { BlueprintCard } from './BlueprintCard'
import { SideBar } from './SideBar'
import { Suspense, useState } from 'react'
import cn from 'classnames'
import { CaretDown } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

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

const blueprintFormAtom = atomWithStorage<BlueprintFormState>(
  'itembox_blueprint_form',
  defaultForm
)

export function ImportBpPage() {
  const { blueprintAddress } = useParams()
  const [ixCodes, setIxCodes] = useState('')
  const [showOptions, setShowOptions] = useState(false)
  const [selectedType, setSelectedType] = useState('resources')
  const state = useAtomValue(blueprintFormAtom)
  const [name, setName] = useState(state?.name || '')
  const [description, setDescription] = useState(state?.description || '')
  const [combinations, setCombinations] = useState('')

  if (!blueprintAddress) return ''

  const handleSelectOption = (value: string) => {
    setSelectedType(value)
    setShowOptions(false)
  }

  return (<div className='absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden'>
    <div className='content flex h-full'>
      <SideBar />
      <div className='inner-content flex flex w-full justify-center items-start gap-4 p-8'>
        <div className='flex w-lg overflow-hidden h-fit max-w-lg'>
          <Suspense fallback={null}>
            <BlueprintCard id={blueprintAddress} />
          </Suspense>
        </div>
        <div className='flex flex-col w-lg overflow-hidden gap-4'>
          <div className='flex flex-col gap-2 relative'>
            <button id='typeDropdown' data-dropdown-toggle='ddOptions' className='text-white px-5 py-2.5 text-start inline-flex items-center rounded pr-6 pl-4 py-3 text-lg border-2 border-transparent bg-stone-600/50 justify-between w-full max-w-full' type='button' onClick={() => setShowOptions(!showOptions)}>
              <span> {(selectedType !== '') ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : 'Item Type'}
                <br />
                {(selectedType !== '') && <small>Item Type</small>}
              </span>
              <CaretDown size={16} />
            </button>
            <div id='ddOptions' className={cn({'hidden': !showOptions},'z-10 w-full divide-y rounded-lg shadow w-44 bg-stone-700 divide-gray-600 absolute top-[90px] right-0')}>
                <ul className='py-2 text-sm text-gray-200' aria-labelledby='dropdownDividerButton'>
                  <li onClick={() => handleSelectOption('resources')}>
                  <a className={cn({'bg-stone-100 bg-stone-600 text-white': selectedType=='resources'},'block px-4 py-2 hover:bg-stone-100 hover:bg-stone-600 hover:text-white')}>Resources</a>
                  </li>
                  <li onClick={() => handleSelectOption('equipment')}>
                    <a className={cn({'bg-stone-100 bg-stone-600 text-white': selectedType=='equipment'},'block px-4 py-2 hover:bg-stone-100 hover:bg-stone-600 hover:text-white')}>Equipment</a>
                  </li>
                </ul>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center justify-between'>
              <span>Name</span>
              <span className='tabular-nums'>({name.length}/1024)</span>
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
              disabled={state?.processing}
            />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center justify-between'>
              <span>Description</span>
              <span className='tabular-nums'>({description.length}/1024)</span>
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value.substring(0, 32))}
              className={cn(
                'flex items-center gap-3',
                'rounded px-4 py-3 text-lg',
                'bg-black/20 w-full'
              )}
              type='text'
              placeholder='Description'
              disabled={state?.processing}
            />
          </div>
          {selectedType == 'equipment' && (
            <>
              <div className='flex flex-col gap-2'>
                <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center justify-between'>
                  <span>Combinations</span>
                  <span className='tabular-nums'>({combinations.length}/64)</span>
                </label>
                <input
                  value={combinations}
                  onChange={(e) => setCombinations(e.target.value.substring(0, 64))}
                  className={cn(
                    'flex items-center gap-3',
                    'rounded px-4 py-3 text-lg',
                    'bg-black/20 w-full'
                  )}
                  type='text'
                  placeholder='Combinations'
                  disabled={state?.processing}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center justify-between'>
                  <span>Skill Instruction Codes</span>
                  <span className='tabular-nums'>({ixCodes.length}/1024)</span>
                </label>
                <textarea
                  value={ixCodes}
                  onChange={(e) =>
                    setIxCodes(e.target.value.substring(0, 1024))
                  }
                  className={cn(
                    'block gap-3',
                    'rounded px-4 py-3 text-lg',
                    'bg-black/20 w-full h-[300px]'
                  )}
                  placeholder='Series of skill hex codes.'
                />
              </div>
            </>
          )}

          <button
            className='flex w-full items-center gap-4 rounded pr-6 pl-4 py-3 text-lg border-2 border-transparent bg-stone-600/50 text-center justify-center'
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>)
}
