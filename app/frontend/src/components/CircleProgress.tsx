import { PrimitiveAtom, useAtomValue } from 'jotai'

export function CircleProgress({
  timestampAtom,
  duration,
}: {
  timestampAtom: PrimitiveAtom<number>
  duration: number
}) {
  const timestamp = useAtomValue(timestampAtom)

  const completeCycle = duration
  const progress = timestamp / completeCycle
  const strokeDasharray = 62.83185307179586
  const strokeDashoffset = strokeDasharray * (1 - (progress % 1))

  return (
    <span className='w-6 h-6 rounded-full bg-stone-950 items-center flex justify-center relative'>
      <svg className='w-5 h-5 text-pink-400' viewBox='0 0 24 24'>
        <circle
          cx='12'
          cy='12'
          r='10'
          stroke='currentColor'
          strokeWidth='2'
          fill='none'
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform='rotate(-90 12 12)'
        />
      </svg>
      <span className='text-xs absolute inset-0 flex items-center justify-center'>
        5
      </span>
    </span>
  )
}
