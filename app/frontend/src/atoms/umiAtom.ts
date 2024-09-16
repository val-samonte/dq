import { atom } from 'jotai'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { connectionCommitmentAtom } from './connectionCommitmentAtom'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairAtom } from './keypairAtom'
import {
  createSignerFromKeypair,
  signerIdentity,
} from '@metaplex-foundation/umi'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

export const umiAtom = atom((get) => {
  const rpc = get(rpcEndpointAtom)
  const commitment = get(connectionCommitmentAtom)
  const kp = get(keypairAtom)
  const umi = createUmi(rpc, commitment)

  umi.use(mplCore())
  umi.use(irysUploader())

  if (kp) {
    const keypair = umi.eddsa.createKeypairFromSecretKey(kp.secretKey)
    const signer = createSignerFromKeypair(umi, keypair)
    umi.use(signerIdentity(signer, true))
  }

  return umi
})
