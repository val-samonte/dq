import { ReactNode } from 'react'

export function PageHeader({ children }: { children: ReactNode }) {
  return (
    <div className='p-5 h-[30vh] text-center flex items-center justify-center'>
      <h2 className='text-3xl tracking-wider'>{children}</h2>
    </div>
  )
}
