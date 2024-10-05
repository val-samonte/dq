import { ReactNode, Suspense } from 'react'
import { BlueprintCard } from './BlueprintCard'
import { CircleNotch } from '@phosphor-icons/react'

export interface BlueprintsGridProps {
  children: ReactNode
  whenEmpty?: ReactNode
  ids: string[]
}

export function BlueprintsGrid({
  children,
  whenEmpty,
  ids,
}: BlueprintsGridProps) {
  return (
    <div className='w-full min-h-[calc(100vh-4rem)] max-w-7xl mx-auto'>
      {children}
      <div className='show-next-when-empty grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-5'>
        {ids.map((id) => (
          <Suspense key={id} fallback={null}>
            <BlueprintCard id={id} />
          </Suspense>
        ))}
      </div>
      <div className='flex items-center justify-center px-5 h-[30vh]'>
        {whenEmpty ?? (
          <CircleNotch size={64} className='opacity-10 animate-spin' />
        )}
      </div>
    </div>
  )
}
