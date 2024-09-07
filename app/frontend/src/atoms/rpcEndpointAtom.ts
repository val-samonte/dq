import { atom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl } from '@solana/web3.js'

export enum RPCDispatchType {
  ADD_CUSTOM_RPC,
  REMOVE_CUSTOM_RPC,
  SWITCH_RPC,
}

interface RPC {
  name?: string
  url: string
  display?: string
  custom?: boolean
  selected?: boolean
}

const officialRpcs: RPC[] = [
  {
    name: 'Devnet',
    url: clusterApiUrl(WalletAdapterNetwork.Devnet),
  },
]

export const rpcEndpointAtom = atomWithStorage(
  'settings_rpc',
  officialRpcs[0].url
)

export const settingsCustomRPCsAtom = atomWithStorage<RPC[]>(
  'settings_custom_rpcs',
  []
)

export const settingsNetworksAtom = atom(
  (get) => {
    const current = get(rpcEndpointAtom)
    const customList = get(settingsCustomRPCsAtom)

    return [...officialRpcs, ...customList].map((rpc) => {
      rpc.selected = current === rpc.url
      const url = new URL(rpc.url)

      rpc.display = `${url.protocol}\/\/${url.hostname}`
      return rpc
    })
  },
  (get, set, { type, url }: { type: RPCDispatchType; url: string }) => {
    switch (type) {
      case RPCDispatchType.ADD_CUSTOM_RPC: {
        const list = get(settingsCustomRPCsAtom)
        if (!list.find((rpc) => rpc.url === url)) {
          set(settingsCustomRPCsAtom, [
            ...list,
            {
              url,
              custom: true,
            },
          ])
        }
        break
      }
      case RPCDispatchType.REMOVE_CUSTOM_RPC: {
        const list = get(settingsCustomRPCsAtom)

        const index = list.findIndex((rpc) => rpc.url === url)

        if (index !== -1) {
          list.splice(index, 1)
          set(settingsCustomRPCsAtom, [...list])
        }

        break
      }
      case RPCDispatchType.SWITCH_RPC: {
        set(rpcEndpointAtom, url)
        break
      }
    }
  }
)
