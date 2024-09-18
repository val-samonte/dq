import { useAtomValue } from 'jotai'
import { charactersAtom } from '../atoms/charactersAtom'
import { ReactNode } from 'react'
import { CharacterCard } from './CharacterCard'

export function CharacterList({ children }: { children?: ReactNode }) {
  const characters = useAtomValue(charactersAtom)

  return characters.length === 0 ? (
    children
  ) : (
    <>
      {characters.map((props) => (
        <CharacterCard {...props} key={'char_card_' + props.publicKey} />
      ))}
    </>
  )
}
