import { atom } from 'jotai'
import { Skill } from '../types/Skill'
import { skills } from '../constants/skills'

export const commandsAtom = atom<Skill[]>(skills)
