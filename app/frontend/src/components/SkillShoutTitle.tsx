import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { lastCommandCalledAtom } from '../atoms/commandsAtom'

export function SkillShoutTitle() {
  const skillTitle = useAtomValue(lastCommandCalledAtom)

  return (
    <div
      className={cn(
        'flex-auto overflow-hidden relative',
        'pointer-events-none select-none text-right flex items-center justify-end'
      )}
    >
      {skillTitle?.command?.type === 'skill' && (
        <div className='w-full relative overflow-hidden'>
          <h2
            key={'skill_' + skillTitle.timeExecuted}
            className={cn(
              'relative',
              'whitespace-nowrap font-serif',
              'flex items-center justify-center',
              'pointer-events-none select-none',
              'animate-fade-in-out',
              'px-3 py-2 bg-gradient-to-r max-w-sm w-full',
              'border-t border-b',
              skillTitle.command.skillType === 'offensive' && [
                'border-red-500/30',
                'from-red-900/0',
                'to-red-900/90',
              ],
              skillTitle.command.skillType === 'supportive' && [
                'border-green-500/30',
                'from-green-900/0',
                'to-green-900/90',
              ],
              skillTitle.command.skillType === 'special' && [
                'border-blue-500/30',
                'from-blue-900/0',
                'to-blue-900/90',
              ]
            )}
          >
            <span>{skillTitle.name}</span>
          </h2>
          <div
            key={'gleam_' + skillTitle.timeExecuted}
            className={cn(
              'animate-slide-gradient',
              'w-full',
              'mix-blend-overlay',
              'pointer-events-none select-none',
              'bg-gradient-to-r from-white/50 to-white/0 absolute right-0 inset-y-0 h-full w-full'
            )}
          />
        </div>
      )}
    </div>
  )
}
//
