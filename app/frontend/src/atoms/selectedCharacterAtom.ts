import { publicKey, PublicKey } from '@metaplex-foundation/umi'
import { atom } from 'jotai'
import { pubkeyAtom } from './keypairAtom'
import { atomFamily, atomWithStorage } from 'jotai/utils'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { umiAtom } from './umiAtom'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { characterUriDetailsAtom } from './characterUriDetailsAtom'
import { getUri } from '../utils/getUri'

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

export const selectedCharacter = atom(async (get) => {
  const selectedAddress = get(selectedCharacterAddressAtom)

  if (!selectedAddress) return null

  const rpc = get(rpcEndpointAtom)
  const umi = get(umiAtom)

  const asset = await fetchAsset(umi, selectedAddress, {
    skipDerivePlugins: true,
  })

  const details = get(characterUriDetailsAtom(getUri(rpc, asset.uri)))

  return { asset, details }
})
