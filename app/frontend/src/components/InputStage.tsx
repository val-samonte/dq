import { ReactNode } from 'react'

export function InputStage({ children }: { children: ReactNode }) {
  return (
    <div className='relative flex-none grid grid-cols-12 max-h-[50%]'>
      <div className='col-span-7 h-full pointer-events-none opacity-0'>
        <div className='aspect-[3/4] h-full pointer-events-none' />
      </div>
      <div className='absolute inset-0 flex flex-col justify-center'>
        <div className='overflow-y-auto overflow-x-hidden'>
          <div className='flex flex-col p-5 gap-5'>{children}</div>
        </div>
      </div>
    </div>
  )
}
