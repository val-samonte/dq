import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { userWalletAtom } from './userWalletAtom'
import { blueprintAtom } from './blueprintAtom'
import {
  Account,
  getAccount,
  getAssociatedTokenAddressSync,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token'
import { connectionAtom } from './connectionAtom'
import { PublicKey } from '@solana/web3.js'

const userTokenAccountBaseAtom = atomFamily((_: string) =>
  atom<Account | null>(null)
)

export const userTokenAccountAtom = atomFamily((id_type: string) =>
  atom(
    (get) => {
      return get(userTokenAccountBaseAtom(id_type))
    },
    async (get, set, force = false) => {
      const connection = get(connectionAtom)

      const wallet = get(userWalletAtom)

      if (!wallet?.publicKey) return

      const [id, assetType] = id_type.split('_')

      if (!id || !assetType) return

      if (assetType === '0') return

      if (get(userTokenAccountBaseAtom(id_type)) || !force) return

      // Blueprint NF [0], Blueprint F [1], SPL [2], Token Extensions [3]. (1)
      switch (assetType) {
        case '1': {
          const blueprint = await get(blueprintAtom(id))

          if (!blueprint) return

          const mint = blueprint.mint

          // const mintInfo = await getMint(
          //   connection,
          //   new PublicKey(mint),
          //   'confirmed',
          //   TOKEN_2022_PROGRAM_ID
          // )

          const ata = getAssociatedTokenAddressSync(
            new PublicKey(mint),
            wallet.publicKey,
            true,
            TOKEN_2022_PROGRAM_ID
          )

          const tokenAccount = await getAccount(
            connection,
            ata,
            'confirmed',
            TOKEN_2022_PROGRAM_ID
          )

          set(userTokenAccountBaseAtom(id_type), tokenAccount)

          break
        }
        case '2': {
          try {
            const mint = id

            const ata = getAssociatedTokenAddressSync(
              new PublicKey(mint),
              wallet.publicKey,
              true,
              TOKEN_PROGRAM_ID
            )

            const tokenAccount = await getAccount(
              connection,
              ata,
              'confirmed',
              TOKEN_PROGRAM_ID
            )

            set(userTokenAccountBaseAtom(id_type), tokenAccount)
          } catch (e) {
            console.log(e)
          }
          break
        }
        case '3': {
          const mint = id

          const ata = getAssociatedTokenAddressSync(
            new PublicKey(mint),
            wallet.publicKey,
            true,
            TOKEN_2022_PROGRAM_ID
          )

          const tokenAccount = await getAccount(
            connection,
            ata,
            'confirmed',
            TOKEN_2022_PROGRAM_ID
          )

          set(userTokenAccountBaseAtom(id_type), tokenAccount)
          break
        }
      }
    }
  )
)
