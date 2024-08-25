export function HUD() {
  return (
    <div className='flex-auto flex flex-col relative'>
      <div className='absolute inset-0 blur-3xl'>
        <img
          src='/target_dummy.png'
          alt='dummy'
          className='w-full h-full object-cover'
        />
      </div>
      <div className='relative flex-none bg-gradient-to-bl from-black via-black/5 to-black/0'>
        <div className='flex p-3 h-full gap-3 flex-row-reverse'>
          <div className='h-full aspect-square bg-stone-900'>{/* image */}</div>
          <div className='flex flex-col gap-2 font-serif text-right items-end'>
            <span className='flex items-end gap-2'>
              <span className='text-4xl'>3456</span>
            </span>
            <span className='flex items-end gap-2'>
              <span className='text-xl'>46</span>
            </span>
          </div>
        </div>
      </div>
      <div className='relative flex-auto'>
        <div className='absolute inset-0'>
          <img
            src='/target_dummy.png'
            alt='dummy'
            className='w-full h-full object-contain'
          />
        </div>
      </div>
      <div className='relative flex-none bg-gradient-to-tr from-black via-black/5 to-black/0'>
        <div className='flex p-3 h-full gap-3'>
          <div className='h-full aspect-square bg-stone-900'>{/* image */}</div>
          <div className='flex flex-col gap-2 font-serif'>
            <span className='flex items-end gap-2'>
              <span className='text-4xl'>1279</span>
            </span>
            <span className='flex items-end gap-2'>
              <span className='text-xl'>469</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
