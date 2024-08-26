import { atom } from 'jotai'
import { Element } from '../enums/Element'
import { Point } from '../types/Point'
import { Command } from '../types/Command'
import { sha256 } from '../utils/sha256'
import bs58 from 'bs58'

export enum RenderActionType {
  COMMAND = 'command',
  SET = 'set',
  LOAD = 'load',
}

export type RenderAction =
  | {
      type: RenderActionType.COMMAND
      command: Command
      points: Point[]
    }
  | {
      type: RenderActionType.SET
      elements: Element[]
    }
  | {
      type: RenderActionType.LOAD
    }

export enum AnimatedCellType {
  DESTROY = 'destroy',
  GRAVITY = 'gravity',
  REPLACE = 'replace',
  SET = 'set',
}

export type AnimatedCell =
  | {
      type: AnimatedCellType.DESTROY
      renderElem: Element
    }
  | {
      type: AnimatedCellType.GRAVITY
      renderElem: Element
      from: number
      new?: boolean
    }
  | {
      type: AnimatedCellType.REPLACE
      prevElem: Element
      renderElem: Element
    }
  | {
      type: AnimatedCellType.SET
      renderElem: Element
    }

export const boardRawAtom = atom<Element[]>([])
export const renderBoardRawAtom = atom<AnimatedCell[]>([])
export const showAuraAtom = atom<Element | null>(null)
const isAnimating = atom(false)

export const renderBoardAtom = atom(
  (get) => {
    return get(renderBoardRawAtom)
  },
  async (get, set, action: RenderAction) => {
    const mapSet = (elem: Element) => ({
      type: AnimatedCellType.SET,
      renderElem: elem,
    })
    switch (action.type) {
      case 'set': {
        set(boardRawAtom, action.elements)
        set(renderBoardRawAtom, action.elements.map(mapSet) as AnimatedCell[])
        return
      }
      case 'load': {
        const elements = get(boardRawAtom)
        set(renderBoardRawAtom, elements.map(mapSet) as AnimatedCell[])
        return
      }
      case 'command': {
        if (get(isAnimating)) return
        set(isAnimating, true)

        const prevBoard = [...get(boardRawAtom)]
        const processedBoard = [...prevBoard]
        const renderBoard = prevBoard.map(mapSet) as AnimatedCell[]
        const indices = action.points.map((point) => point.y * 3 + point.x)
        set(renderBoardRawAtom, prevBoard.map(mapSet) as AnimatedCell[])

        // process command and store various states for cell animations

        // step 1: process delete and replace
        indices.forEach((index, i) => {
          processedBoard[index] = Element.Empty
          renderBoard[index] = {
            type: AnimatedCellType.DESTROY,
            renderElem: renderBoard[index].renderElem,
          }

          // todo: possible bug here with output
          if (action.command.links[0].output && i === indices.length - 1) {
            processedBoard[index] = action.command.links[0].output
            renderBoard[index] = {
              type: AnimatedCellType.REPLACE,
              prevElem: renderBoard[index].renderElem,
              renderElem: processedBoard[index],
            }
          }
        })
        const destroyAndReplaceAnimatedCells = renderBoard.map((cell) => ({
          ...cell,
        }))

        // step 2: process gravity
        const fillers = Array.from(
          await sha256(
            bs58.encode(new Uint8Array(prevBoard)) +
              JSON.stringify(action.points)
          )
        )
          .slice(0, 12)
          .map(
            (byte) => [Element.ChaosI, Element.LifeI, Element.ArcaneI][byte % 3]
          )

        const fallCountTable = Array(12).fill(-1)
        for (let column = 0; column < 3; column++) {
          let fallCount = 0
          let fallCountRow = 3
          for (let row = 3; row >= 0; row--) {
            if (processedBoard[row * 3 + column] === Element.Empty) {
              fallCount++
              fallCountTable[fallCountRow * 3 + column] = fallCount
            } else {
              fallCountTable[fallCountRow * 3 + column] = fallCount
              fallCountRow--
            }
          }
          for (let row = fallCountRow; row >= 0; row--) {
            if (fallCountTable[row * 3 + column] === -1) {
              fallCountTable[row * 3 + column] = fallCount
            }
          }

          for (let row = 3; row >= 0; row--) {
            const index = row * 3 + column
            if (fallCountTable[index] > 0) {
              const targetIndex = (row - fallCountTable[index]) * 3 + column
              if (targetIndex >= 0) {
                processedBoard[index] = processedBoard[targetIndex]
                processedBoard[targetIndex] = Element.Empty
              } else {
                processedBoard[index] = Element.Empty
              }
            }
          }
        }

        for (let i = 0; i < 12; i++) {
          let isNew = false
          if (processedBoard[i] === Element.Empty) {
            processedBoard[i] = fillers.shift() as Element
            isNew = true
          }
          if (fallCountTable[i] > 0) {
            renderBoard[i] = {
              type: AnimatedCellType.GRAVITY,
              renderElem: processedBoard[i],
              from: fallCountTable[i],
              new: isNew,
            }
          }
        }
        const gravityAnimatedCells = renderBoard.map((cell) => ({ ...cell }))

        set(boardRawAtom, processedBoard)

        // step 1: animate destroy (200ms) and replace (300ms)
        set(renderBoardRawAtom, destroyAndReplaceAnimatedCells)
        await sleep(300)

        // step 2: animate gravity
        set(renderBoardRawAtom, gravityAnimatedCells)
        await sleep(400)

        set(isAnimating, false)
        return
      }
    }
  }
)

// sleep function
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
