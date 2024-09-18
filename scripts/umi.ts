import { mplCore } from '@metaplex-foundation/mpl-core'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { signerIdentity } from '@metaplex-foundation/umi'
import { loadUmiKeypair } from './utils'

const masterAddress = 'DQTN1gmL1UsoFfk2sPSD8MnjRWi46N3xx4vK3kFt23aA'

const umi = createUmi('https://api.devnet.solana.com/', 'confirmed')

umi.use(mplCore())

const masterSigner = loadUmiKeypair(umi, `./keypairs/${masterAddress}.json`)

if (masterSigner.publicKey !== masterAddress) {
  throw new Error('Master keypair is corrupted!')
}

umi.use(signerIdentity(masterSigner))

export default umi
