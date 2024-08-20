import { atom } from 'jotai'
import { Command } from '../types/Command'
import { Element } from '../enums/Element'
import { Point } from '../types/Point'
import { boardRawAtom } from './gameBoardAtom'

export const lastCommandCallAtom = atom<{
  command: Command
  elements: Element[]
  key: number
} | null>(null)

export const commandCallTitleAtom = atom(
  (get) => {
    const lastCommandCall = get(lastCommandCallAtom)

    if (lastCommandCall && lastCommandCall.command.type === 'skill') {
      const isLevel3 = lastCommandCall.elements.every(
        (element) =>
          (element & 0b1100_0000) === 0b1100_0000 ||
          (element & 0b0000_1100) === 0b0000_1100
      )
      const isLevel2 = lastCommandCall.elements.every(
        (element) =>
          (element & 0b0100_0000) === 0b0100_0000 ||
          (element & 0b0000_0100) === 0b0000_0100
      )
      return {
        name: lastCommandCall.command.name,
        type: lastCommandCall.command.skillType,
        level: isLevel3 ? 3 : isLevel2 ? 2 : 1,
        key: lastCommandCall.key,
      }
    }
    return null
  },
  (get, set, action: { command: Command; unitPoints: Point[] }) => {
    const board = get(boardRawAtom)
    const elements = action.unitPoints.map(
      (point) => board[point.y * 3 + point.x]
    )
    if (action.command.type === 'skill') {
      set(lastCommandCallAtom, {
        command: action.command,
        elements,
        key: Date.now(),
      })
    }
  }
)
