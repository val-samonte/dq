import { Element } from '../enums/Element'
import { Skill } from '../types/Skill'

export const skills: Skill[] = [
  {
    name: 'Fireball',
    links: [
      {
        elements: [Element.ChaosI, Element.ChaosI, Element.ArcaneI],
      },
    ],
    cost: 3,
  },
  {
    name: 'Harden',
    links: [
      {
        elements: [Element.LifeI, Element.LifeI, Element.ArcaneI],
      },
    ],
    cost: 2,
  },
  {
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
    name: 'Enhance Life',
    links: [
      {
        elements: [Element.LifeI, Element.LifeI, Element.LifeI],
        output: Element.LifeII,
      },
      {
        elements: [Element.LifeII, Element.LifeII, Element.LifeII],
        output: Element.LifeIII,
      },
    ],
    cost: 1,
  },
  {
    name: 'Enhance Arcane',
    links: [
      {
        elements: [Element.ArcaneI, Element.ArcaneI, Element.ArcaneI],
        output: Element.ArcaneII,
      },
      {
        elements: [Element.ArcaneII, Element.ArcaneII, Element.ArcaneII],
        output: Element.ArcaneIII,
      },
    ],
    cost: 1,
  },
  {
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
