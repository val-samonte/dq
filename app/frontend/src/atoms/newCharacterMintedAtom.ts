import { PublicKey } from '@metaplex-foundation/umi'
import { atom } from 'jotai'
import { umiAtom } from './umiAtom'
import { fetchAsset } from '@metaplex-foundation/mpl-core'
import { rpcEndpointAtom } from './rpcEndpointAtom'

export const newCharacterMintedBaseAtom = atom<PublicKey | null>(null)
export const newCharacterMintedAtom = atom(
  async (get) => {
    const rpc = get(rpcEndpointAtom)
    const umi = get(umiAtom)
    const minted = get(newCharacterMintedBaseAtom)

    if (!minted) return null

    // fetch asset details
    const asset = await fetchAsset(umi, minted, {
      skipDerivePlugins: true,
    })

    // fetch uri
    let uri = asset.uri
    console.log(rpc, rpc.toLowerCase().includes('devnet'))
    if (rpc.toLowerCase().includes('devnet')) {
      uri = uri.replace('https://arweave.net/', 'https://devnet.irys.xyz/')
    }

    const uriResponse = await fetch(uri)
    const details = await uriResponse.json()

    return { asset, details }
  },
  (_, set, mintAddress: PublicKey | null) => {
    set(newCharacterMintedBaseAtom, mintAddress)
  }
)
