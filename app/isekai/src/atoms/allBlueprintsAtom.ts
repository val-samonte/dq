import { atom } from 'jotai'
import { programAtom } from './programAtom'
import { getDiscriminator } from '../utils/getDiscriminator'

export const allBlueprintsBaseAtom = atom<string[]>([])

export const allBlueprintsAtom = atom(
  (get) => {
    return get(allBlueprintsBaseAtom)
  },
  async (get, set) => {
    const program = get(programAtom)

    if (program) {
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
          ],
          dataSlice: { offset: 0, length: 0 },
        }
      )

      set(
        allBlueprintsBaseAtom,
        accounts.slice(0, 100).map((a) => a.pubkey.toBase58())
      )
    }
  }
)
