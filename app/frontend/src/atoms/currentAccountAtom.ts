import { atomWithStorage } from 'jotai/utils'

export const currentAccountAtom = atomWithStorage<string | null>(
  'deezquest_current_account',
  null
)
