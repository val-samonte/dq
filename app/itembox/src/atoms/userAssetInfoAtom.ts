// asset_assettype

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { userWalletAtom } from './userWalletAtom'
import { das } from '@metaplex-foundation/mpl-core-das'
import { umiAtom } from './umiAtom'
import { publicKey } from '@metaplex-foundation/umi'
import { blueprintAtom } from './blueprintAtom'

const refresher = atomFamily((_: string) => atom(Date.now()))

export interface UserAssetInfoAtom {
  items: any[]
}

export const userAssetInfoAtom = atomFamily((id_type: string) =>
  atom(
    async (get) => {
      get(refresher(id_type))

      const wallet = get(userWalletAtom)

      if (!wallet?.publicKey) return null

      const [id, assetType] = id_type.split('_')

      if (!id || !assetType) return null

      // Blueprint NF [0], Blueprint F [1], SPL [2], Token Extensions [3]. (1)
      switch (assetType) {
        case '0': {
          const umi = get(umiAtom)
          const blueprint = await get(blueprintAtom(id))

          if (!blueprint) return null

          // better to use assets by owner
          // might need to migrate this as well to an atom
          const result = await das.getAssetsByOwner(umi, {
            // collection: publicKey(blueprint.mint),
            owner: publicKey(wallet.publicKey.toBase58()),
            skipDerivePlugins: true,
          })
          console.log(blueprint.mint, blueprint.id)
          return result
          break
        }
        case '1': {
          break
        }
        case '2': {
          break
        }
        case '3': {
          break
        }
      }
    },
    (_, set) => {
      set(refresher(id_type), Date.now())
    }
  )
)

// // Fetch assets by owner
// const assetsByOwner = await das.getAssetsByOwner(umi, {
//   owner: publicKey('<ownerPublicKey>'),
// });

// // Fetch assets by collection
// const assetsByCollection = await das.getAssetsByCollection(umi, {
//   collection: publicKey('<collectionPublicKey>'),
// });

// console.log(blueprint.mint, blueprint.id)

// AhN3znhjnBWqsapf4joQB2zgNCtFkC6fWZn7ZdxWSDn7 DoLMjzc9AHt8oDhE9KRksZjzPcpeS6oc2bcvRXS7asot

// [
//   {
//     "publicKey": "8R7UcEEu3ChqDkmvu4dJYnLw3gEaaGezC1crTHEKa4oe",
//     "uri": "https://arweave.net/BzfTnx52yoh8GnS3pYfVPv985sonFhHrsJipcXGiYjgX",
//     "name": "Furnace",
//     "content": {
//       "$schema": "https://schema.metaplex.com/nft1.0.json",
//       "json_uri": "https://arweave.net/BzfTnx52yoh8GnS3pYfVPv985sonFhHrsJipcXGiYjgX",
//       "files": [
//         {
//           "uri": "https://arweave.net/CXcUcQBFAiCbiGDd1kig74oyoh7PXqfqpzt75Dn5EeSe",
//           "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://arweave.net/CXcUcQBFAiCbiGDd1kig74oyoh7PXqfqpzt75Dn5EeSe",
//           "mime": "image/png"
//         }
//       ],
//       "metadata": {
//         "description": "Used to refine OREs - [Play TriNexus Now](https://deez.quest)",
//         "name": "Furnace",
//         "symbol": ""
//       },
//       "links": {
//         "image": "https://arweave.net/CXcUcQBFAiCbiGDd1kig74oyoh7PXqfqpzt75Dn5EeSe"
//       }
//     },
//     "header": {
//       "executable": false,
//       "owner": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
//       "lamports": {
//         "basisPoints": "-1",
//         "identifier": "SOL",
//         "decimals": 9
//       },
//       "exists": true
//     },
//     "edition": {
//       "authority": {
//         "type": "Address",
//         "address": "EEe8Hpkavi6cvHf7YAUKPipjYywbz6rp7YW85xijm1s1"
//       },
//       "number": 1,
//       "offset": "155"
//     },
//     "key": 1,
//     "owner": "Dt29kEgXxKtBBmKBHgRuXMEuMMtHhTBDBGVrt9UYwzHC",
//     "seq": {
//       "__option": "None"
//     },
//     "updateAuthority": {
//       "type": "Collection",
//       "address": "AhN3znhjnBWqsapf4joQB2zgNCtFkC6fWZn7ZdxWSDn7"
//     }
//   }
// ]

// [
//   {
//     "publicKey": "8R7UcEEu3ChqDkmvu4dJYnLw3gEaaGezC1crTHEKa4oe",
//     "header": {
//       "executable": false,
//       "owner": "CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d",
//       "lamports": {
//         "basisPoints": "-1",
//         "identifier": "SOL",
//         "decimals": 9
//       },
//       "exists": true
//     },
//     "pluginHeader": {
//       "key": 3,
//       "pluginRegistryOffset": "133"
//     },
//     "key": 1,
//     "updateAuthority": {
//       "type": "Collection",
//       "address": "AhN3znhjnBWqsapf4joQB2zgNCtFkC6fWZn7ZdxWSDn7"
//     },
//     "name": "Furnace",
//     "uri": "https://arweave.net/BzfTnx52yoh8GnS3pYfVPv985sonFhHrsJipcXGiYjgX",
//     "content": {
//       "$schema": "https://schema.metaplex.com/nft1.0.json",
//       "json_uri": "https://arweave.net/BzfTnx52yoh8GnS3pYfVPv985sonFhHrsJipcXGiYjgX",
//       "files": [
//         {
//           "uri": "https://arweave.net/CXcUcQBFAiCbiGDd1kig74oyoh7PXqfqpzt75Dn5EeSe",
//           "cdn_uri": "https://cdn.helius-rpc.com/cdn-cgi/image//https://arweave.net/CXcUcQBFAiCbiGDd1kig74oyoh7PXqfqpzt75Dn5EeSe",
//           "mime": "image/png"
//         }
//       ],
//       "metadata": {
//         "description": "Used to refine OREs - [Play TriNexus Now](https://deez.quest)",
//         "name": "Furnace",
//         "symbol": ""
//       },
//       "links": {
//         "image": "https://arweave.net/CXcUcQBFAiCbiGDd1kig74oyoh7PXqfqpzt75Dn5EeSe"
//       }
//     },
//     "edition": {
//       "authority": {
//         "type": "Address",
//         "address": "EEe8Hpkavi6cvHf7YAUKPipjYywbz6rp7YW85xijm1s1"
//       },
//       "number": 1,
//       "offset": "155"
//     },
//     "owner": "Dt29kEgXxKtBBmKBHgRuXMEuMMtHhTBDBGVrt9UYwzHC",
//     "seq": {
//       "__option": "None"
//     }
//   }
// ]
