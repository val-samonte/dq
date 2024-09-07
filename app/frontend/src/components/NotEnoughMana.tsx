import cn from 'classnames'
import { useAtomValue } from 'jotai'
import { commandManaDiffAtom } from '../atoms/hud'

export function NotEnoughMana() {
  const manaDiff = useAtomValue(commandManaDiffAtom)

  return (
    <div
      className={cn(
        manaDiff && manaDiff < 0 ? 'animate-fade-in' : 'animate-fade-out',
        'overflow-hidden absolute inset-x-0 bottom-0 pointer-events-none flex justify-center items-end w-full h-[20%] px-5 py-3',
        'bg-gradient-to-t from-black to-black/0'
      )}
    >
      <span className={cn('text-center')}>Not Enough Mana</span>
    </div>
  )
}
