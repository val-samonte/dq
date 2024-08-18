import { atom } from 'jotai'
import { Command } from '../types/Command'
import { commands } from '../constants/commands'
import { inputUnitPointsAtom } from './inputUnitPointsAtom'
import { cellsAtom } from './cellsAtom'
import { Point } from '../types/Point'

export const commandsBaseAtom = atom<Command[]>(commands)

interface CommandGroups {
  skills: Command[]
  enhancements: Command[]
  conjurations: Command[]
  transmutations: Command[]
}

export const commandsAtom = atom<CommandGroups>((get) => {
  const commands = get(commandsBaseAtom)
  const input = get(inputUnitPointsAtom)
  const board = get(cellsAtom)

  const linkSelection = input.map((point) => board[pointToIndex(point)])
  let filteredCommands = commands
    .map((command) => {
      return {
        ...command,
        links: command.links.filter((link) => {
          return linkSelection.every((elem, i) => {
            return link.elements[i] === elem
          })
        }),
      }
    })
    .filter((command) => {
      return command.links.length > 0
    })

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

function pointToIndex(point: Point) {
  return point.y * 3 + point.x
}
