import { atom } from 'jotai'
import { Command } from '../types/Command'
import { commands } from '../constants/commands'
import { inputUnitPointsAtom } from './inputUnitPointsAtom'
import { boardRawAtom } from './gameBoardAtom'
import { Point } from '../types/Point'
import { Element } from '../enums/Element'

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
  const board = get(boardRawAtom)

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

export interface CommandMatched {
  command: Command
  unitPoints: Point[]
  linkSelection: Element[]
  name: string
  timeExecuted?: number
  level?: number
}

export const lastCommandCalledBaseAtom = atom<CommandMatched | null>(null)
export const lastCommandCalledAtom = atom(
  (get) => {
    const matched = get(lastCommandCalledBaseAtom)
    return {
      ...matched,
      timeExecuted: Date.now(),
    }
  },
  (_, set, command: CommandMatched | null) => {
    set(lastCommandCalledBaseAtom, command)
  }
)

export const commandMatchedAtom = atom<CommandMatched | null>((get) => {
  const input = get(inputUnitPointsAtom)
  const board = get(boardRawAtom)
  const commands = get(commandsAtom)

  const linkSelection = input.map((point) => board[point.y * 3 + point.x])
  let command = commands.find((command) => {
    const link = command.links.find((link) => {
      if (link.elements.length !== linkSelection.length) {
        return false
      }

      return link.elements.every((elem, i) => {
        if (link.strictLevel) {
          return elem === linkSelection[i]
        }
        return (elem & 0b0011_0011) === (linkSelection[i] & 0b0011_0011)
      })
    })

    if (!link) {
      return false
    }

    return {
      ...command,
      links: [link],
    }
  })

  if (!command) {
    return null
  }

  let level = 0
  if (command.type === 'skill') {
    const isLevel3 = linkSelection.every(
      (element) =>
        (element & 0b1100_0000) === 0b1100_0000 ||
        (element & 0b0000_1100) === 0b0000_1100
    )
    const isLevel2 = linkSelection.every(
      (element) =>
        (element & 0b0100_0000) === 0b0100_0000 ||
        (element & 0b0000_0100) === 0b0000_0100
    )

    level = isLevel3 ? 3 : isLevel2 ? 2 : 1
  }

  return {
    name: `${level === 3 ? 'Giga ' : level === 2 ? 'Mega ' : ''}${
      command.name
    }`,
    command,
    unitPoints: input,
    linkSelection,
    level,
  }
})
