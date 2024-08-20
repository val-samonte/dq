import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { commandCallTitleAtom } from '../atoms/commandCallTitleAtom'

export function SkillShoutTitle() {
  const skillTitle = useAtomValue(commandCallTitleAtom)

  return (
    <div className='absolute top-0 inset-x-0 pointer-events-none select-none text-center flex items-center justify-center p-5'>
      {skillTitle && (
        <h2
          key={skillTitle?.key}
          className={cn(
            'animate-fade-in-out',
            'text-xl px-3 py-2 bg-gradient-to-r max-w-sm w-full',
            'border-t border-b',
            skillTitle.type === 'offensive' && [
              skillTitle.level === 3
                ? 'border-red-500'
                : skillTitle.level === 2
                ? 'border-red-500/50'
                : 'border-red-500/20',
              'from-red-500/0 to-red-500/0',
              skillTitle.level === 3
                ? 'via-red-500/30'
                : skillTitle.level === 2
                ? 'via-red-500/20'
                : 'via-red-500/10',
            ],
            skillTitle.type === 'supportive' && [
              skillTitle.level === 3
                ? 'border-green-500'
                : skillTitle.level === 2
                ? 'border-green-500/50'
                : 'border-green-500/20',
              'from-green-500/0 to-green-500/0',
              skillTitle.level === 3
                ? 'via-green-500/30'
                : skillTitle.level === 2
                ? 'via-green-500/20'
                : 'via-green-500/10',
            ],
            skillTitle.type === 'special' && [
              skillTitle.level === 3
                ? 'border-blue-500'
                : skillTitle.level === 2
                ? 'border-blue-500/50'
                : 'border-blue-500/20',
              'from-blue-500/0 to-blue-500/0',
              skillTitle.level === 3
                ? 'via-blue-500/30'
                : skillTitle.level === 2
                ? 'via-blue-500/20'
                : 'via-blue-500/10',
            ]
          )}
        >
          {`${
            skillTitle.level === 3
              ? 'Giga '
              : skillTitle.level === 2
              ? 'Mega '
              : ''
          }${skillTitle.name}`}
        </h2>
      )}
    </div>
  )
}
