import { publicKey, PublicKey } from '@metaplex-foundation/umi'
import { atom } from 'jotai'
import { pubkeyAtom } from './keypairAtom'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { characterAtom } from './charactersAtom'

export const selectedCharacterAddressBaseAtom = atomFamily((pubkey: string) =>
  atomWithStorage<PublicKey | null>(
    `deezquest_current_character_${pubkey}`,
    null
  )
)

export const selectedCharacterAddressAtom = atom(
  (get) => {
    const pubkey = get(pubkeyAtom)

    if (!pubkey) return null

    const character = get(selectedCharacterAddressBaseAtom(pubkey))

    return character
  },
  (get, set, select: string | null) => {
    const pubkey = get(pubkeyAtom)
    if (!pubkey) return
    set(
      selectedCharacterAddressBaseAtom(pubkey),
      select ? publicKey(select) : null
    )
  }
)

export const selectedCharacterAtom = atom(async (get) => {
  const selectedAddress = get(selectedCharacterAddressAtom)

  if (!selectedAddress) return null

  return await get(characterAtom(selectedAddress))
})
