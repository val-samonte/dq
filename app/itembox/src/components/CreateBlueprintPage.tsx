import cn from 'classnames'
import { Nav } from './Nav'
import {
  CheckCircle,
  CheckSquare,
  CircleNotch,
  Play,
  RadioButton,
  Square,
} from '@phosphor-icons/react'
import { useRef, useState } from 'react'

export function CreateBlueprintPage() {
  const [nonFungible, setNonfungible] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className='absolute inset-0 flex flex-col'>
      <Nav />
      <div className='flex-auto relative overflow-hidden flex flex-col justify-center'>
        <div className='overflow-x-hidden overflow-y-auto w-full'>
          <div className='mx-auto flex flex-col items-center gap-5 p-5 max-w-7xl'>
            <div className='px-5 flex flex-col gap-10 justify-center'>
              <h2 className='text-3xl tracking-wider text-center pt-5'>
                Create a new Blueprint
              </h2>
              <div
                className={cn(
                  'rounded-lg bg-gray-800/10 drop-shadow-md',
                  '',
                  'flex flex-col md:flex-row overflow-hidden'
                )}
              >
                <div className='flex-none'>
                  <div className='min-h-80 w-80 landscape:min-h-96 landscape:w-96 h-full bg-black/20 flex items-center justify-center'>
                    <button
                      className='w-full aspect-square'
                      onClick={() => {
                        fileInputRef.current?.click()
                      }}
                    >
                      Select Image
                    </button>
                    <input
                      type='file'
                      ref={fileInputRef}
                      accept='image/jpeg, image/png, image/webp'
                      onChange={(event) => {
                        if (event?.target?.files) {
                          if (event?.target?.files?.length > 0) {
                            console.log(
                              'File selected:',
                              event.target.files[0].name
                            )
                          }
                        }
                      }}
                      className='hidden'
                    />
                  </div>
                </div>
                <div className='flex-none'>
                  <div className='min-w-80 w-full flex flex-col gap-5 p-5'>
                    <div>
                      <input
                        className={cn(
                          'flex items-center gap-3',
                          'rounded px-6 py-3 text-lg',
                          'bg-black/20 w-full'
                        )}
                        type='text'
                        placeholder='Name'
                      />
                    </div>
                    <div>
                      <textarea
                        className={cn(
                          'flex items-center gap-3',
                          'rounded px-6 py-3 text-lg',
                          'bg-black/20 w-full'
                        )}
                        placeholder='Description'
                      />
                    </div>
                    <div>
                      <button
                        className='flex items-center gap-3 pr-3'
                        onClick={() => setNonfungible((c) => !c)}
                      >
                        {nonFungible ? (
                          <CheckSquare size={24} />
                        ) : (
                          <Square size={24} />
                        )}
                        <span>Non-Fungible</span>
                      </button>
                    </div>
                    <div>
                      <input
                        className={cn(
                          'flex items-center gap-3',
                          'rounded px-6 py-3 text-lg',
                          'bg-black/20 w-full'
                        )}
                        type='text'
                        placeholder='Mint Authority'
                      />
                    </div>
                    <div>
                      <input
                        className={cn(
                          'flex items-center gap-3',
                          'rounded px-6 py-3 text-lg',
                          'bg-black/20 w-full'
                        )}
                        type='text'
                        placeholder='Treasury'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col items-center justify-between gap-10'>
                <div className='flex-none flex gap-2 text-slate-400 items-center'>
                  <CheckCircle size={32} className='opacity-100' />
                  <CircleNotch size={32} className='opacity-10 animate-spin' />
                  <span>Uploading Metadata</span>
                  <RadioButton size={32} className='opacity-10' />
                </div>
                <div className='flex-none mx-auto'>
                  <button
                    className={cn(
                      'w-full',
                      'flex items-center gap-3',
                      'rounded pr-6 pl-4 py-3 text-lg',
                      'border-2 border-amber-300/50',
                      'bg-gradient-to-t from-purple-800 to-fuchsia-800'
                    )}
                  >
                    <Play size={24} />
                    Start Process
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
