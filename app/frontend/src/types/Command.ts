import { Element } from '../enums/Element'

export interface CommandLinks {
  strictLevel?: boolean
  elements: Element[]
  output: Element
}

export type Command =
  | {
      type: 'skill'
      skillType: 'offensive' | 'supportive' | 'special'
      name: string
      cost: number
      links: Omit<CommandLinks, 'output'>[]
    }
  | {
      type: 'enhance' | 'transmute' | 'manifest'
      name: string
      cost: number
      links: CommandLinks[]
    }
