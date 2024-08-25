export function HomeScreen() {
  return (
    <div className='w-full h-full flex flex-col p-3 gap-3'>
      <div
        className='h-32 rounded-xl relative overflow-hidden flex flex-col justify-end border border-stone-800'
        style={{
          backgroundImage: 'url("/bg_library.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className='text-white font-serif relative text-2xl px-3 py-2 bg-gradient-to-tr from-black via-black/0 to-black/0'>
          Tutorial
        </span>
      </div>
    </div>
  )
}
