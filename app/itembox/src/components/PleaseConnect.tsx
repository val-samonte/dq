import { Smiley } from '@phosphor-icons/react'

export function PleaseConnect() {
  return (
    <div className='flex flex-col gap-5 items-center justify-center text-center min-h-[calc(100vh-4rem)]'>
      <Smiley size={32} />
      <div>Please connect your wallet to continue</div>
    </div>
  )
}
