// given blueprint, get recipes

import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { programAtom } from './programAtom'
import { getDiscriminator } from '../utils/getDiscriminator'

const recipesBaseAtom = atomFamily((_: string) => atom<string[]>([]))

export const recipesAtom = atomFamily((id: string) =>
  atom(
    (get) => {
      return get(recipesBaseAtom(id))
    },
    async (get, set) => {
      const program = get(programAtom)

      // todo: set new Promise to show suspense loading

      const recipeDiscriminator = await getDiscriminator('Recipe')

      const accounts = await program.provider.connection.getProgramAccounts(
        program.programId,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: recipeDiscriminator,
              },
            },
            {
              memcmp: {
                offset: 9, // discriminator + bump
                bytes: id,
              },
            },
          ],
          dataSlice: { offset: 0, length: 0 },
        }
      )

      set(
        recipesBaseAtom(id),
        accounts.map((a) => a.pubkey.toBase58())
      )
    }
  )
)
