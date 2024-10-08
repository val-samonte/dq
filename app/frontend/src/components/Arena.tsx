import { Suspense } from 'react';
import { InputStage } from './InputStage';
import { Link } from 'react-router-dom';

export function Arena() {
  return (
    <div className='flex-auto h-full w-full flex flex-col'>
      <div
        className='flex-auto flex flex-col relative'
        style={{
          backgroundImage: 'url("/bg_arena.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <Suspense fallback={null}>
          
        </Suspense>
      </div>
      <InputStage>
        <Suspense fallback={null}>
          
          <Link
            to={'/'}
            className='bg-stone-900 p-5 gap-2 rounded-xl relative overflow-hidden flex flex-col justify-center border border-stone-800 transition-all duration-300 hover:scale-[1.025]'
          >
            <div className='flex flex-col gap-2'>
              <p className='text-sm'>
                &ldquo;There is no event in the arena yet. I shall return later.&rdquo;
              </p>
            </div>
          </Link>
          
        </Suspense>
      </InputStage>
    </div>
  )
}