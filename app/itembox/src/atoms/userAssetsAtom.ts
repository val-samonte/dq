import { atom } from 'jotai'
import { userWalletAtom } from './userWalletAtom'
import { das } from '@metaplex-foundation/mpl-core-das'
import { umiAtom } from './umiAtom'
import { publicKey } from '@metaplex-foundation/umi'
import { explorerAddress } from '../utils/explorerAddress'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { getIrysUri } from '../utils/getIrysUri'
import { trimAddress } from '../utils/trimAddress'
import { PublicKey } from '@solana/web3.js'
import { programAtom } from './programAtom'
import { toWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'

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
    const programId = get(programAtom).programId

    if (!list || list.length === 0) return []

    return list.map((asset) => {
      const id = asset.publicKey.toString()
      const img = (asset.content.files ?? []).find((f) =>
        f.mime?.includes('image')
      )

      let blueprintId = ''

      if (asset.updateAuthority.address) {
        const [pda] = PublicKey.findProgramAddressSync(
          [
            Buffer.from('blueprint'),
            toWeb3JsPublicKey(asset.updateAuthority.address).toBytes(),
          ],
          programId
        )
        blueprintId = pda.toBase58()
      }

      return {
        id,
        blueprintId,
        collectionId: asset.updateAuthority.address?.toString() || '',
        name: asset.name,
        image: img?.uri && getIrysUri(rpc, img.uri),
        tags: [
          {
            label: 'ID',
            value: trimAddress(id),
            href: explorerAddress(id),
          },
          {
            label: 'BP',
            value: blueprintId ? trimAddress(blueprintId) : 'Unknown',
            to: blueprintId ? `/blueprints/${blueprintId}` : undefined,
          },
          {
            label: '#',
            value: asset.edition?.number.toString() || '?',
          },
        ],
      }
    })
  },
  (_, set) => {
    set(refresher, Date.now())
  }
)
