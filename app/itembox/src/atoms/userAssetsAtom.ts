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
import { AssetResult } from '@metaplex-foundation/mpl-core-das/dist/src/types'

interface UserAsset {
  id: string
  blueprintId: string
  collectionId: string
  name: string
  image?: string
  tags: { label: string; value?: string; href?: string; to?: string }[]
}

const userAssetsRawBase = atom<AssetResult[]>([])
const userAssetsBase = atom<UserAsset[]>([])

export const userAssetsRawAtom = atom(
  (get) => {
    return get(userAssetsRawBase)
  },
  async (get, set) => {
    const wallet = get(userWalletAtom)
    if (!wallet?.publicKey) return null

    const umi = get(umiAtom)

    const assets = await das.getAssetsByOwner(umi, {
      owner: publicKey(wallet.publicKey.toBase58()),
      skipDerivePlugins: true,
    })

    set(userAssetsRawBase, assets)
  }
)

export const userAssetsAtom = atom(
  (get) => {
    return get(userAssetsBase)
  },
  async (get, set) => {
    await set(userAssetsRawAtom)

    const rpc = get(rpcEndpointAtom)
    const list = get(userAssetsRawAtom)
    const programId = get(programAtom).programId

    if (!list || list.length === 0) return []

    set(
      userAssetsBase,
      list.map((asset) => {
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
    )
  }
)
