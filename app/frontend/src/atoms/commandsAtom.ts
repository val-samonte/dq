import { atom } from 'jotai'
import { Command } from '../types/Command'
import { commands } from '../constants/commands'
import { inputUnitPointsAtom } from './inputUnitPointsAtom'
import { cellsAtom } from './cellsAtom'

export const commandsBaseAtom = atom<Command[]>(commands)

interface CommandGroups {
  skills: Command[]
  enhancements: Command[]
  conjurations: Command[]
  transmutations: Command[]
}

export const commandsAtom = atom<Command[]>((get) => {
  const commands = get(commandsBaseAtom)
  const input = get(inputUnitPointsAtom)
  const board = get(cellsAtom)

  const linkSelection = input.map((point) => board[point.y * 3 + point.x])
  return commands
    .map((command) => {
      return {
        ...command,
        links: command.links.filter((link) => {
          return linkSelection.every((elem, i) => {
            if (link.strictLevel) {
              return link.elements[i] === elem
            }
            // neutralize element level
            return (link.elements[i] & 0b0011_0011) === (elem & 0b0011_0011)
          })
        }),
      }
    })
    .filter((command) => {
      return command.links.length > 0
    })
})

export const commandGroupAtom = atom<CommandGroups>((get) => {
  const filteredCommands = get(commandsAtom)
  let skills = filteredCommands.filter((command) => command.type === 'skill')
  let enhancements = filteredCommands.filter(
    (command) => command.type === 'enhance'
  )
  let conjurations = filteredCommands.filter(
    (command) => command.type === 'conjure'
  )
  let transmutations = filteredCommands.filter(
    (command) => command.type === 'transmute'
  )

  return {
    skills,
    enhancements,
    conjurations,
    transmutations,
  }
})
