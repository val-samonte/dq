import { atom } from 'jotai'
import { commandMatchedAtom } from './commandsAtom'

export const manaAtom = atom(0)
export const commandManaDiffAtom = atom((get) => {
  const mana = get(manaAtom)
  const matched = get(commandMatchedAtom)

  if (!matched) return null

  return mana - matched.command.cost
})
