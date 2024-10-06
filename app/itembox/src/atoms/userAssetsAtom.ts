import { atom } from 'jotai'
import { userWalletAtom } from './userWalletAtom'
import { das } from '@metaplex-foundation/mpl-core-das'
import { umiAtom } from './umiAtom'
import { publicKey } from '@metaplex-foundation/umi'
import { explorerAddress } from '../utils/explorerAddress'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { getIrysUri } from '../utils/getIrysUri'

const refresher = atom(Date.now())

export const userAssetsRawAtom = atom(
  async (get) => {
    get(refresher)

    const wallet = get(userWalletAtom)
    if (!wallet?.publicKey) return null

    const umi = get(umiAtom)

    const assets = await das.getAssetsByOwner(umi, {
      owner: publicKey(wallet.publicKey.toBase58()),
      skipDerivePlugins: true,
    })

    return assets
  },
  (_, set) => {
    set(refresher, Date.now())
  }
)

export const userAssetsAtom = atom(
  async (get) => {
    const rpc = get(rpcEndpointAtom)
    const list = await get(userAssetsRawAtom)

    if (!list || list.length === 0) return []

    return list.map((asset) => {
      const id = asset.publicKey.toString()
      const collection = asset.updateAuthority.address?.toString()
      const img = (asset.content.files ?? []).find((f) =>
        f.mime?.includes('image')
      )

      return {
        id,
        collection,
        name: asset.name,
        image: img?.uri && getIrysUri(rpc, img.uri),
        tags: [
          {
            label: 'ID',
            value: id,
            href: explorerAddress(id),
          },
          {
            label: 'BP',
            value: collection || 'Unknown',
            to: collection ? `/blueprints/${collection}` : undefined,
          },
          {
            label: '#',
            value: asset.edition?.number || '?',
          },
        ],
      }
    })
  },
  (_, set) => {
    set(refresher, Date.now())
  }
)
