import { generateSigner } from '@metaplex-foundation/umi'
import umi from './umi'
import {
  createCollection,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import bs58 from 'bs58'
import { loadUmiKeypair } from './utils'

const collectionAddress = 'DQTNzhozAXtDbhYCdiWVQ61Ky3j99DdTvp79mB84TUDL'
const collectionSigner = loadUmiKeypair(
  umi,
  `./keypairs/${collectionAddress}.json`
)

const main = async () => {
  console.log('Signer pubkey:', collectionSigner.publicKey)

  const result = await createCollection(umi, {
    collection: collectionSigner,
    name: 'DeezQuest Characters',
    uri: 'https://deez.quest/characters.json',
  }).sendAndConfirm(umi)

  console.log('Tx signature:', bs58.encode(result.signature))

  const collection = await fetchCollection(umi, collectionSigner.publicKey)

  console.log('Collection:', collection)
}

main()
