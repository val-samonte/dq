import { ReactNode } from 'react'

export function CenterWrapper({ children }: { children: ReactNode }) {
  return (
    <div className='flex-auto relative overflow-hidden flex flex-col justify-center'>
      <div className='overflow-x-hidden overflow-y-auto w-full'>
        <div className='mx-auto flex flex-col items-center gap-5 p-5 max-w-7xl'>
          <div className='flex flex-col gap-10 justify-center'>{children}</div>
        </div>
      </div>
    </div>
  )
}
