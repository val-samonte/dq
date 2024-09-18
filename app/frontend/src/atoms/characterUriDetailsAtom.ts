import { atom } from 'jotai'
import { atomFamily } from 'jotai/utils'

export const characterUriDetailsAtom = atomFamily((uri: string) =>
  atom(async () => {
    try {
      const uriResponse = await fetch(uri)
      const details = await uriResponse.json()
      return details as {
        name: string
        description: string
        image: string
      }
    } catch (e) {
      return null
    }
  })
)
