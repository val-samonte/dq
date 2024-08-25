import { atom } from 'jotai'

export enum Dialogs {
  NONE,
  NEW_GAME,
}

export const showDialogAtom = atom<Dialogs>(Dialogs.NONE)
