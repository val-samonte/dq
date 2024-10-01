export function BlueprintCard() {
  return (
    <div className='overflow-hidden rounded-lg flex flex-col bg-gray-800/10 drop-shadow-md'>
      <div className='bg-gray-600/5 w-full aspect-square flex items-center justify-center p-5'>
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
