import { atom } from 'jotai'
import { programAtom } from './programAtom'
import { ItemboxSDK } from '../sdk/itembox-sdk'

export const itemboxSdkAtom = atom((get) => {
  const program = get(programAtom)

  if (!program) {
    return null
  }

  return new ItemboxSDK(program)
})
