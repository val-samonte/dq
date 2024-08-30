import { Element } from '../enums/Element'
import { Command } from '../types/Command'

export const samplerSkills: Command[] = [
  {
    type: 'skill',
    skillType: 'offensive',
    name: 'Fireball',
    links: [
      {
        elements: [Element.ChaosI, Element.ChaosI, Element.ArcaneI],
      },
    ],
    cost: 3,
  },
  {
    type: 'skill',
    skillType: 'supportive',
    name: 'Focus',
    links: [
      {
        elements: [Element.LifeI, Element.LifeI, Element.ArcaneI],
      },
    ],
    cost: 2,
  },
  {
    type: 'skill',
    skillType: 'special',
    name: 'Shuffle',
    links: [
      {
        elements: [
          Element.ArcaneI,
          Element.ArcaneI,
          Element.LifeI,
          Element.ChaosI,
        ],
      },
    ],
    cost: 4,
  },
  {
    type: 'skill',
    skillType: 'offensive',
    name: 'Lightning Bolt',
    links: [
      {
        elements: [Element.OblivionI, Element.ChaosI, Element.ArcaneI],
      },
    ],
    cost: 3,
  },
  {
    type: 'skill',
    skillType: 'supportive',
    name: 'Heal',
    links: [
      {
        elements: [Element.LifeI, Element.FateI, Element.ArcaneI],
      },
    ],
    cost: 2,
  },
  {
    type: 'skill',
    skillType: 'special',
    name: 'Tornado',
    links: [
      {
        elements: [
          Element.EssenceI,
          Element.EssenceI,
          Element.ChaosI,
          Element.LifeI,
        ],
      },
    ],
    cost: 4,
  },
]

export const transmuteCommands: Command[] = [
  {
    type: 'transmute',
    name: 'Transmute Chaos',
    links: [
      {
        strictLevel: true,
        elements: [Element.LifeI, Element.ArcaneI],
        output: Element.ChaosI,
      },
      {
        strictLevel: true,
        elements: [Element.ArcaneI, Element.LifeI],
        output: Element.ChaosI,
      },
    ],
    cost: 2,
  },
  {
    type: 'transmute',
    name: 'Transmute Life',
    links: [
      {
        strictLevel: true,
        elements: [Element.ChaosI, Element.ArcaneI],
        output: Element.LifeI,
      },
      {
        strictLevel: true,
        elements: [Element.ArcaneI, Element.ChaosI],
        output: Element.LifeI,
      },
    ],
    cost: 2,
  },
  {
    type: 'transmute',
    name: 'Transmute Arcane',
    links: [
      {
        strictLevel: true,
        elements: [Element.LifeI, Element.ChaosI],
        output: Element.ArcaneI,
      },
      {
        strictLevel: true,
        elements: [Element.ChaosI, Element.LifeI],
        output: Element.ArcaneI,
      },
    ],
    cost: 2,
  },
]

export const enchanceCommandsT1: Command[] = [
  {
    type: 'enhance',
    name: 'Enhance Chaos',
    links: [
      {
        strictLevel: true,
        elements: [Element.ChaosI, Element.ChaosI, Element.ChaosI],
        output: Element.ChaosII,
      },
      {
        strictLevel: true,
        elements: [Element.ChaosII, Element.ChaosII, Element.ChaosII],
        output: Element.ChaosIII,
      },
    ],
    cost: 1,
  },
  {
    type: 'enhance',
    name: 'Enhance Life',
    links: [
      {
        strictLevel: true,
        elements: [Element.LifeI, Element.LifeI, Element.LifeI],
        output: Element.LifeII,
      },
      {
        strictLevel: true,
        elements: [Element.LifeII, Element.LifeII, Element.LifeII],
        output: Element.LifeIII,
      },
    ],
    cost: 1,
  },
  {
    type: 'enhance',
    name: 'Enhance Arcane',
    links: [
      {
        strictLevel: true,
        elements: [Element.ArcaneI, Element.ArcaneI, Element.ArcaneI],
        output: Element.ArcaneII,
      },
      {
        strictLevel: true,
        elements: [Element.ArcaneII, Element.ArcaneII, Element.ArcaneII],
        output: Element.ArcaneIII,
      },
    ],
    cost: 1,
  },
]

export const enchanceCommandsT2: Command[] = [
  // tier 2
  {
    type: 'enhance',
    name: 'Enhance Oblivion',
    links: [
      {
        strictLevel: true,
        elements: [Element.OblivionI, Element.OblivionI, Element.OblivionI],
        output: Element.OblivionII,
      },
      {
        strictLevel: true,
        elements: [Element.OblivionII, Element.OblivionII, Element.OblivionII],
        output: Element.OblivionIII,
      },
    ],
    cost: 1,
  },
  {
    type: 'enhance',
    name: 'Enhance Fate',
    links: [
      {
        strictLevel: true,
        elements: [Element.FateI, Element.FateI, Element.FateI],
        output: Element.FateII,
      },
      {
        strictLevel: true,
        elements: [Element.FateII, Element.FateII, Element.FateII],
        output: Element.FateIII,
      },
    ],
    cost: 1,
  },
  {
    type: 'enhance',
    name: 'Enhance Essence',
    links: [
      {
        strictLevel: true,
        elements: [Element.EssenceI, Element.EssenceI, Element.EssenceI],
        output: Element.EssenceII,
      },
      {
        strictLevel: true,
        elements: [Element.EssenceII, Element.EssenceII, Element.EssenceII],
        output: Element.EssenceIII,
      },
    ],
    cost: 1,
  },
]

export const enchanceCommands: Command[] = [
  ...enchanceCommandsT1,
  ...enchanceCommandsT2,
]

export const conjureCommands: Command[] = [
  {
    type: 'conjure',
    name: 'Conjure Oblivion',
    links: [
      {
        strictLevel: true,
        elements: [Element.ChaosI, Element.ArcaneII],
        output: Element.OblivionI,
      },
      {
        strictLevel: true,
        elements: [Element.ChaosII, Element.ArcaneI],
        output: Element.OblivionI,
      },
      {
        strictLevel: true,
        elements: [Element.ArcaneII, Element.ChaosI],
        output: Element.OblivionI,
      },
      {
        strictLevel: true,
        elements: [Element.ArcaneI, Element.ChaosII],
        output: Element.OblivionI,
      },
    ],
    cost: 1,
  },
  {
    type: 'conjure',
    name: 'Conjure Fate',
    links: [
      {
        strictLevel: true,
        elements: [Element.LifeI, Element.ChaosII],
        output: Element.FateI,
      },
      {
        strictLevel: true,
        elements: [Element.LifeII, Element.ChaosI],
        output: Element.FateI,
      },
      {
        strictLevel: true,
        elements: [Element.ChaosII, Element.LifeI],
        output: Element.FateI,
      },
      {
        strictLevel: true,
        elements: [Element.ChaosI, Element.LifeII],
        output: Element.FateI,
      },
    ],
    cost: 1,
  },
  {
    type: 'conjure',
    name: 'Conjure Essence',
    links: [
      {
        strictLevel: true,
        elements: [Element.ArcaneI, Element.LifeII],
        output: Element.EssenceI,
      },
      {
        strictLevel: true,
        elements: [Element.ArcaneII, Element.LifeI],
        output: Element.EssenceI,
      },
      {
        strictLevel: true,
        elements: [Element.LifeII, Element.ArcaneI],
        output: Element.EssenceI,
      },
      {
        strictLevel: true,
        elements: [Element.LifeI, Element.ArcaneII],
        output: Element.EssenceI,
      },
    ],
    cost: 1,
  },
]

export const commands: Command[] = [
  ...samplerSkills,
  ...transmuteCommands,
  ...enchanceCommands,
  ...conjureCommands,
]
