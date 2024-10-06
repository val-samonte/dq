import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { userWalletAtom } from './userWalletAtom'
import { blueprintAtom } from './blueprintAtom'

const userTokenBalanceBaseAtom = atomFamily((_: string) => atom(null))

export const userTokenBalanceAtom = atomFamily((id_type: string) =>
  atom(
    (get) => {
      return get(userTokenBalanceBaseAtom(id_type))
    },
    async (get, set) => {
      // set(refresher(id_type), Date.now())

      const wallet = get(userWalletAtom)

      if (!wallet?.publicKey) return null

      const [id, assetType] = id_type.split('_')

      if (!id || !assetType) return null

      // Blueprint NF [0], Blueprint F [1], SPL [2], Token Extensions [3]. (1)
      switch (assetType) {
        case '1': {
          const blueprint = await get(blueprintAtom(id))

          if (!blueprint) return null

          const mint = blueprint.mint

          // get token2022 ata
          // decimal is always 0

          break
        }
        case '2': {
          // const metadata = await get(tokenDataAtom(id))
          // if (!metadata) return null

          // metadata.decimals
          // get spl ata
          break
        }
        case '3': {
          // const metadata = await get(tokenDataAtom(id))
          // get token2022 ata
          break
        }
      }
    }
  )
)
