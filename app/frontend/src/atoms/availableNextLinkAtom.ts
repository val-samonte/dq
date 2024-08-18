import { atom } from 'jotai'
import { commandsAtom } from './commandsAtom'
import { inputUnitPointsAtom } from './inputUnitPointsAtom'
import { cellsAtom } from './cellsAtom'
import { Point } from '../types/Point'
import { Element } from '../enums/Element'

export const availableNextLinkAtom = atom((get) => {
  const input = get(inputUnitPointsAtom)
  if (input.length === 0) return null

  const tail = input[input.length - 1]

  // get adjacent cells of the tail
  const adjacentCells = [
    { x: tail.x - 1, y: tail.y },
    { x: tail.x + 1, y: tail.y },
    { x: tail.x, y: tail.y - 1 },
    { x: tail.x, y: tail.y + 1 },
    { x: tail.x - 1, y: tail.y - 1 },
    { x: tail.x + 1, y: tail.y - 1 },
    { x: tail.x - 1, y: tail.y + 1 },
    { x: tail.x + 1, y: tail.y + 1 },
  ]

  // filter out invalid cells
  const validCells = adjacentCells.filter(({ x, y }) => {
    const withinRange = x >= 0 && x < 3 && y >= 0 && y < 4
    const notVisited = !input.some((point) => point.x === x && point.y === y)
    return withinRange && notVisited
  })

  if (validCells.length === 0) return []

  const commands = get(commandsAtom)
  const board = get(cellsAtom)

  // get all next elements available
  const availableElements = Array.from(
    new Set(
      commands
        .map((command) =>
          command.links
            .map((link) => {
              const next = link.elements[input.length]

              if (!next) return []

              if (!link.strictLevel) {
                if ((0b0000_1111 & next) === next) {
                  // all tier 1 levels
                  const elem = 0b0000_0011 & next
                  return [elem, 0b0000_0100 | elem, 0b0000_1100 | elem]
                } else {
                  // all tier 2 levels
                  const elem = 0b0011_0000 & next
                  return [elem, 0b0100_0000 | next, 0b1100_0000 | next]
                }
              }
              return [next]
            })
            .flat()
        )
        .flat()
    )
  ) as Element[]

  return validCells.reduce((acc, point) => {
    const elem = board[point.y * 3 + point.x]
    if (availableElements.includes(elem)) {
      return [...acc, point]
    }
    return acc
  }, [] as Point[])
})
