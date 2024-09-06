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
        <>
          <h2
            key={'skill_' + skillTitle.timeExecuted}
            className={cn(
              'relative',
              'whitespace-nowrap',
              'flex items-center justify-end',
              'animate-fade-in-out',
              'text-lg px-3 py-2 bg-gradient-to-r max-w-sm w-full',
              'border-t border-b',
              skillTitle.command.skillType === 'offensive' && [
                'border-red-500',
                'from-red-900/0',
                'to-red-900/90',
              ],
              skillTitle.command.skillType === 'supportive' && [
                'border-green-500',
                'from-green-900/0',
                'to-green-900/90',
              ],
              skillTitle.command.skillType === 'special' && [
                'border-blue-500',
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
              'bg-gradient-to-r from-white/100 to-white/0 mix-blend-overlay absolute right-0 h-full w-full'
            )}
          />
        </>
      )}
    </div>
  )
}
//
