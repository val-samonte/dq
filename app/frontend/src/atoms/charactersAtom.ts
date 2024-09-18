import { atom } from 'jotai'
import { umiAtom } from './umiAtom'
import { fetchAssetsByOwner } from '@metaplex-foundation/mpl-core'
import { masterAddress } from '../constants/addresses'
import { keypairAtom } from './keypairAtom'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { getUri } from '../utils/getUri'

const refresherAtom = atom(Date.now())
export const charactersAtom = atom(
  async (get) => {
    get(refresherAtom)

    const kp = get(keypairAtom)
    if (!kp) return []

    const rpc = get(rpcEndpointAtom)
    const umi = get(umiAtom)

    const pubkey = fromWeb3JsPublicKey(kp.publicKey)

    try {
      const result = await fetchAssetsByOwner(umi, pubkey)

      return result
        .filter((asset) => asset.updateAuthority.address === masterAddress)
        .map((asset) => {
          return {
            publicKey: asset.publicKey,
            uri: getUri(rpc, asset.uri),
            name: asset.name,
          }
        })
    } catch (e) {
      console.error(e)
    }

    return []
  },
  (_, set) => {
    set(refresherAtom, Date.now())
  }
)
