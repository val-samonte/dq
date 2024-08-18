import { atom } from 'jotai'
import { Element } from '../enums/Element'
import { Point } from '../types/Point'
import { Command } from '../types/Command'

export enum RenderActionType {
  COMMAND = 'command',
  SET = 'set',
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

export enum AnimatedCellType {
  DESTROY = 'destroy',
  GRAVITY = 'gravity',
  REPLACE = 'replace',
  SET = 'set',
}

type AnimatedCell =
  | {
      type: AnimatedCellType.DESTROY
      renderElem: Element
      key: string
    }
  | {
      type: AnimatedCellType.GRAVITY
      renderElem: Element
      from: number
      key: string
    }
  | {
      type: AnimatedCellType.REPLACE
      prevElem: Element
      renderElem: Element
      key: string
    }
  | {
      type: AnimatedCellType.SET
      renderElem: Element
      key: string
    }

export const boardRawAtom = atom<Element[]>([])
export const renderBoardRawAtom = atom<AnimatedCell[]>([])
const isAnimating = atom(false)

export const renderBoardAtom = atom(
  (get) => {
    return get(renderBoardRawAtom)
  },
  async (get, set, action: RenderAction) => {
    switch (action.type) {
      case 'set': {
        set(boardRawAtom, action.elements)
        set(
          renderBoardRawAtom,
          action.elements.map((elem, i) => ({
            type: AnimatedCellType.SET,
            renderElem: elem,
            key: Date.now() + '_' + i,
          })) as AnimatedCell[]
        )
        return
      }
      case 'command': {
        // set(boardRawAtom, action.elements)
        if (get(isAnimating)) return
        set(isAnimating, true)

        // step 1: destroy (200ms) and replace (300ms)
        await sleep(200)
        // step 2: gravity
        await sleep(300)
        // step 3: set

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
