import cn from 'classnames'
import { commandMatchedAtom } from '../atoms/commandsAtom'
import { useAtomValue } from 'jotai'

export function NotEnoughMana({ mana }: { mana: number }) {
  const matched = useAtomValue(commandMatchedAtom)

  return (
    <div
      className={cn(
        matched && mana < matched.command.cost
          ? 'animate-fade-in'
          : 'animate-fade-out',
        'overflow-hidden absolute inset-0 pointer-events-none flex justify-center items-end w-full z-10 px-5 py-3',
        'bg-[radial-gradient(circle_at_bottom,rgba(0,0,0,1),rgba(0,0,0,0))]'
      )}
    >
      <span className={cn('font-serif text-center font-bold ')}>
        Not Enough Mana
      </span>
    </div>
  )
}
