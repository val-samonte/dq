import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'
import { programAtom } from './programAtom'

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
      if (!program) return

      // todo: set new Promise to show suspense loading

      const accounts = await program.provider.connection.getProgramAccounts(
        program.programId,
        {
          filters: [
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
