import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { BlueprintRecord, idbAtom } from './idbAtom'
import { programAtom } from './programAtom'
import { IdlAccounts } from '@coral-xyz/anchor'
import { Itembox } from '../sdk/itembox'
import { BatchCallback } from '../utils/BatchCallback'
import { umiAtom } from './umiAtom'
import { fetchCollection } from '@metaplex-foundation/mpl-core'
import { fromWeb3JsPublicKey } from '@metaplex-foundation/umi-web3js-adapters'
import {
  getMetadataPointerState,
  getMint,
  getTokenMetadata,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token'
import { rpcEndpointAtom } from './rpcEndpointAtom'
import { getIrysUri } from '../utils/getIrysUri'

type BatchResult = {
  account: IdlAccounts<Itembox>['blueprint']
  publicKey: string
}[]

const batchFetcherAtom = atom((get) => {
  const program = get(programAtom)

  return new BatchCallback<BatchResult>(async (addresses) => {
    const result = await program.account.blueprint.fetchMultiple(addresses)
    return result.map((account, i) => ({
      account,
      publicKey: addresses[i],
    })) as BatchResult
  })
})

const refresher = atomFamily((_: string) => atom(Date.now()))

export const blueprintAtom = atomFamily((id: string) =>
  atom(
    async (get) => {
      if (!id) return null

      get(refresher(id))
      const idb = await get(idbAtom('records'))

      if (!idb) return null

      // todo: should we use unresolved promise?
      return (await idb.get('blueprints', id)) || null
    },
    async (get, set, force = false) => {
      if (!id) return null
      const rpc = get(rpcEndpointAtom)
      const idb = await get(idbAtom('records'))
      if (!idb) return

      if (!force) {
        const record = await idb.get('blueprints', id)
        // return if cached, unless forced
        if (record) return
      }

      const program = get(programAtom)

      const fetcher = get(batchFetcherAtom)

      const batchAddresses = await fetcher.add(id)
      const result = batchAddresses.find(({ publicKey }) => publicKey === id)

      if (!result?.account) return
      const data = result.account

      let name: string
      let uri: string

      if (data.nonFungible) {
        const umi = get(umiAtom)
        const metadata = await fetchCollection(
          umi,
          fromWeb3JsPublicKey(data.mint)
        )
        name = metadata.name
        uri = metadata.uri
      } else {
        const mintInfo = await getMint(
          program.provider.connection,
          data.mint,
          program.provider.connection.commitment,
          TOKEN_2022_PROGRAM_ID
        )

        const metadataPointer = getMetadataPointerState(mintInfo)

        const metadata = await getTokenMetadata(
          program.provider.connection,
          metadataPointer?.metadataAddress ?? data.mint,
          program.provider.connection.commitment,
          TOKEN_2022_PROGRAM_ID
        )

        if (!metadata)
          throw new Error(`${data.mint.toBase58()} token metadata not found`)

        name = metadata.name
        uri = metadata.uri
      }

      const response = await fetch(getIrysUri(rpc, uri))
      const jsonMetadata = await response.json()

      const blueprint: BlueprintRecord = {
        id,
        name: jsonMetadata?.name || name,
        description: jsonMetadata?.description || '',
        image: getIrysUri(rpc, jsonMetadata?.image || ''),
        uri,
        mint: data.mint.toBase58(),
        nonFungible: data.nonFungible,
        authority: data.authority.toBase58(),
        treasury: data.treasury.toBase58(),
        mintAuthority: data.mintAuthority.toBase58(),
      }

      await idb.put('blueprints', blueprint)

      set(refresher(id), Date.now())
    }
  )
)
