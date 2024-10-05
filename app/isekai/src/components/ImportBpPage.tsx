import { useParams } from 'react-router-dom'
import { BlueprintCard } from './BlueprintCard'
import { Nav } from './Nav'
import { SideBar } from './SideBar'
import { Suspense, useState } from 'react'
import cn from 'classnames'
import { UploadSimple } from '@phosphor-icons/react'

export function ImportBpPage() {
  const { blueprintAddress } = useParams()
  const [ixCodes, setIxCodes] = useState('')

  if (!blueprintAddress) return ''

  return (<div className='absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden'>
    <Nav />
    <div className='content flex h-full'>
      <SideBar />
      <div className='inner-content flex flex w-full justify-center items-start gap-4 p-8'>
        <div className='flex w-lg overflow-hidden h-fit max-w-lg'>
          <Suspense fallback={null}>
            <BlueprintCard id={blueprintAddress} />
          </Suspense>
        </div>
        <div className='flex flex-col w-lg overflow-hidden gap-4'>
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

          <button
            className='flex w-full items-center gap-4 rounded pr-6 pl-4 py-3 text-lg border-2 border-transparent bg-gray-600/50 text-center justify-center'
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  </div>)
}
