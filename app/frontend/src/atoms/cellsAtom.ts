import { atom } from 'jotai'
import { Element } from '../enums/Element'

export const cellsAtom = atom<Element[]>([])
