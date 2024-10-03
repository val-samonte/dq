import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { programAtom } from './programAtom'
import { getDiscriminator } from '../utils/getDiscriminator'

export const userBlueprintsBaseAtom = atomFamily((_: string) =>
  atom<string[]>([])
)

export const userBlueprintsAtom = atomFamily((id: string) =>
  atom(
    (get) => {
      if (!id) return []
      return get(userBlueprintsBaseAtom(id))
    },
    async (get, set) => {
      const program = get(programAtom)

      // todo: set new Promise to show suspense loading
      const blueprintDiscriminator = await getDiscriminator('Blueprint')

      const accounts = await program.provider.connection.getProgramAccounts(
        program.programId,
        {
          filters: [
            {
              memcmp: {
                offset: 0,
                bytes: blueprintDiscriminator,
              },
            },
            {
              memcmp: {
                offset: 42, // authority
                bytes: id,
              },
            },
          ],
          dataSlice: { offset: 0, length: 0 },
        }
      )

      set(
        userBlueprintsBaseAtom(id),
        accounts.map((a) => a.pubkey.toBase58())
      )
    }
  )
)
