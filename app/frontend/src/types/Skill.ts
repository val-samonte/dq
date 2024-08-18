import { Element } from '../enums/Element'

export interface SkillLink {
  strictLevel?: boolean
  elements: Element[]
  output?: Element
}

export interface Skill {
  name: string
  links: SkillLink[]
  cost: number
}
