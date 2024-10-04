import { ReactNode } from 'react'

export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div className='px-5 h-[20vh] text-center flex items-center justify-center'>
      <h2 className='text-3xl tracking-wider flex flex-col gap-5'>
        {children}
      </h2>
    </div>
  )
}
