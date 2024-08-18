import { atom } from 'jotai'
import { Command } from '../types/Command'
import { commands } from '../constants/commands'

export const commandsAtom = atom<Command[]>(commands)
