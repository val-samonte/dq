import { Board } from './Board'
import { CommandList } from './CommandList'

export function TutorialBasic() {
  return (
    <div className='flex-auto h-full w-full flex flex-col'>
      <div className='flex-auto flex flex-col relative'></div>
      <div className='relative flex-none grid grid-cols-12 max-h-[50%]'>
        <div className='col-span-7 bg-stone-950/80 h-full overflow-hidden'>
          <Board />
        </div>
        <div className='col-span-5 relative'>
          <div className='absolute inset-0 overflow-x-hidden overflow-y-auto bg-stone-950'>
            <CommandList />
          </div>
        </div>
      </div>
    </div>
  )
}
