import { CircleNotch, Stack } from '@phosphor-icons/react'
import { useAtomValue, useSetAtom } from 'jotai'
import { blueprintAtom } from '../atoms/blueprintAtom'
import { Suspense, useEffect } from 'react'
import { trimAddress } from '../utils/trimAddress'
import { Link } from 'react-router-dom'

function CardSkeleton() {
  return (
    <div className='overflow-hidden rounded-lg flex flex-col bg-gray-700'>
      <div className='bg-black/20 w-full aspect-square flex items-center justify-center p-2'>
        <div className='w-full aspect-square flex items-center justify-center'>
          <CircleNotch size={64} className='opacity-10 animate-spin' />
        </div>
      </div>
      <div className='p-2 flex flex-col gap-3'>
        <h3 className='text-lg px-3 py-1'>
          <div className='w-44 h-7 animate-pulse bg-white/20 rounded' />
        </h3>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-1 p-3 rounded bg-black/10'>
            <div className='text-xs uppercase tracking-wider opacity-50'>
              <div className='w-6 h-4 animate-pulse bg-white/20 rounded' />
            </div>
            <div className='text-sm'>
              <div className='w-24 h-5 animate-pulse bg-white/20 rounded' />
            </div>
          </div>
          <div className='flex flex-col gap-1 p-3 rounded bg-black/10'>
            <div className='text-xs uppercase tracking-wider opacity-50'>
              <div className='w-20 h-4 animate-pulse bg-white/20 rounded' />
            </div>
            <div className='text-sm'>
              <div className='w-24 h-5 animate-pulse bg-white/20 rounded' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CardWithData({ id }: { id: string }) {
  const blueprint = useAtomValue(blueprintAtom(id))

  if (!blueprint) {
    return <CardSkeleton />
  }

  return (
    <div className='overflow-hidden rounded-lg flex flex-col bg-gray-700'>
      <Link
        to={`/blueprints/${id}`}
        className='bg-black/20 w-full aspect-square flex items-center justify-center p-2 relative'
      >
        <img
          src={blueprint.image}
          alt=''
          className='object-contain h-full rounded-t'
        />
        {!blueprint.nonFungible && (
          <div className='absolute top-0 left-0 p-5 opacity-50'>
            <Stack size={32} />
          </div>
        )}
      </Link>
      <div className='p-2 flex flex-col gap-3'>
        <h3 className='text-lg px-3 py-1'>
          <Link to={`/blueprints/${id}`}>{blueprint.name}</Link>
        </h3>
        <div className='grid grid-cols-2 gap-2'>
          <Link
            to={`/blueprints/${id}`}
            className='flex flex-col gap-1 p-3 rounded bg-black/10'
          >
            <div className='text-xs uppercase tracking-wider opacity-50'>
              ID
            </div>
            <div className='text-sm'>{trimAddress(blueprint.id)}</div>
          </Link>
          <Link
            to={`/user/${blueprint.authority}`}
            className='flex flex-col gap-1 p-3 rounded bg-black/10'
          >
            <div className='text-xs uppercase tracking-wider opacity-50'>
              Creator
            </div>
            <div className='text-sm'>{trimAddress(blueprint.authority)}</div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export function BlueprintCard({ id }: { id: string }) {
  const reload = useSetAtom(blueprintAtom(id))

  useEffect(() => {
    reload()
  }, [id])

  return (
    <Suspense fallback={<CardSkeleton />}>
      <CardWithData id={id} />
    </Suspense>
  )
}
