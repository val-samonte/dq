import cn from 'classnames'
import { commandMatchedAtom } from '../atoms/commandsAtom'
import { useAtomValue } from 'jotai'

export function NotEnoughMana({ mana }: { mana: number }) {
  const matched = useAtomValue(commandMatchedAtom)

  if (!matched) return null
  if (mana >= matched.command.cost) return null

  return (
    <div
      className={cn(
        'overflow-hidden absolute inset-0 pointer-events-none flex justify-center w-full z-10 p-5',
        'bg-[radial-gradient(circle_at_top,rgba(0,0,0,1),rgba(0,0,0,0))]'
      )}
    >
      <span
        className={cn('animate-fade-in', 'font-serif text-center font-bold ')}
      >
        Not Enough Mana
      </span>
    </div>
  )
}
