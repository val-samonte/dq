export function BlueprintCard() {
  return (
    <div className='overflow-hidden rounded-lg flex flex-col bg-gray-700 border border-gray-400/5'>
      <div className='bg-black/20 w-full aspect-square flex items-center justify-center p-5'>
        <img src='/Copperdagger.png' alt='' className='object-contain h-full' />
      </div>
      <div className='p-5 flex flex-col gap-3'>
        <h3 className='text-lg font-bold tracking-wider'>Copper Sword</h3>
        <p className='text-sm'>
          <span className='opacity-50'>By: </span>
          <span>Dt29...YwzHC</span>
        </p>
      </div>
    </div>
  )
}
