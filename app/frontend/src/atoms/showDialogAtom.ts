import { atom } from 'jotai'

export enum Dialogs {
  NONE,
  NEW_GAME,
  MAIN_MENU,
  GAME_ACCOUNT,
  EXPORT_PRIVATE_KEY,
}

export const showDialogAtom = atom<Dialogs>(Dialogs.NONE)
