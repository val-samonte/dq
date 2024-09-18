import { PublicKey } from '@metaplex-foundation/umi'
import { atom } from 'jotai'
import { umiAtom } from './umiAtom'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { charactersAtom } from './charactersAtom'
import { getUri } from '../utils/getUri'
import { characterUriDetailsAtom } from './characterUriDetailsAtom'

export const newCharacterMintedBaseAtom = atom<PublicKey | null>(null)
export const newCharacterMintedAtom = atom(
  async (get) => {
    const rpc = get(rpcEndpointAtom)
    const umi = get(umiAtom)
    const minted = get(newCharacterMintedBaseAtom)

    if (!minted) return null

    const asset = await fetchAsset(umi, minted, {
      skipDerivePlugins: true,
    })

    const details = get(characterUriDetailsAtom(getUri(rpc, asset.uri)))

    return { asset, details }
  },
  (_, set, mintAddress: PublicKey | null) => {
    set(charactersAtom)
    set(newCharacterMintedBaseAtom, mintAddress)
  }
)
