import { atom } from 'jotai'
import { commandMatchedAtom } from './commandsAtom'

export const manaAtom = atom<number | null>(null)
export const commandManaDiffAtom = atom((get) => {
  const mana = get(manaAtom)
  const matched = get(commandMatchedAtom)

  if (mana === null) return null
  if (!matched) return null

  return mana - matched.command.cost
})
