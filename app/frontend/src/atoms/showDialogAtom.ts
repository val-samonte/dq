import { atom } from 'jotai'

export enum Dialogs {
  NONE,
  NEW_GAME,
  MAIN_MENU,
  GAME_ACCOUNT,
  EXPORT_PRIVATE_KEY,
  LOAD_GAME,
  NOT_ENOUGH_BALANCE,
  MINT_CHARACTER,
  DEVNET_NOTICE,
}

export const showDialogAtom = atom<Dialogs>(Dialogs.NONE)
