import { ReactNode, Suspense } from 'react'
import { BlueprintCard } from './BlueprintCard'
import { CircleNotch } from '@phosphor-icons/react'

export interface BlueprintsGridProps {
  whenEmpty?: ReactNode
  ids: string[]
  simpleView: boolean
}

export function BlueprintsGrid({
  whenEmpty,
  ids,
  simpleView = false
}: BlueprintsGridProps) {
  return (
    <div className='w-auto min-h-auto max-w-7xl mx-auto'>
      <div className='show-next-when-empty grid grid-cols-4 gap-5 px-5'>
        {ids.map((id) => (
          <Suspense key={id} fallback={null}>
            <BlueprintCard id={id} simpleView={simpleView} />
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
