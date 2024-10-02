import { ReactNode, Suspense } from 'react'
import { BlueprintCard } from './BlueprintCard'

export interface BlueprintsGridProps {
  children: ReactNode
  ids: string[]
}

export function BlueprintsGrid({ children, ids }: BlueprintsGridProps) {
  return (
    <div className='w-full min-h-screen max-w-7xl mx-auto'>
      {children}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5 px-5'>
        {ids.map((id) => (
          <Suspense key={id} fallback={null}>
            <BlueprintCard id={id} />
          </Suspense>
        ))}
      </div>
    </div>
  )
}