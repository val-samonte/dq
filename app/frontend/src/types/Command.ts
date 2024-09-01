import { Element } from '../enums/Element'

export interface CommandLinks {
  strictLevel?: boolean
  elements: Element[]
  output?: Element
}

export type Command =
  | {
      type: 'skill'
      skillType: 'offensive' | 'supportive' | 'special'
      name: string
      cost: number
      links: CommandLinks[]
      damage?: number[]
    }
  | {
      type: 'enhance' | 'transmute' | 'conjure'
      name: string
      cost: number
      links: CommandLinks[]
    }
