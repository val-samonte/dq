import { atom } from 'jotai'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import { userWalletAtom } from './userWalletAtom'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api'

export const umiAtom = atom((get) => {
  const wallet = get(userWalletAtom)
  const rpc = get(rpcEndpointAtom)
  const umi = createUmi(rpc)

  umi.use(mplCore())
  umi.use(dasApi())
  umi.use(irysUploader())

  if (wallet?.publicKey) {
    umi.use(walletAdapterIdentity(wallet))
  }

  return umi
})
