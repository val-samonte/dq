import { Suspense, useEffect } from 'react'
import { BlueprintsGrid } from './BlueprintsGrid'
import { PageHeader } from './PageHeader'
import { useAtomValue, useSetAtom } from 'jotai'
import { allBlueprintsAtom } from '../atoms/allBlueprintsAtom'

function Content() {
  const blueprints = useAtomValue(allBlueprintsAtom)

  return (
    <BlueprintsGrid ids={blueprints}>
      <PageHeader>Explore Blueprints</PageHeader>
    </BlueprintsGrid>
  )
}

export function AllBlueprints() {
  const reload = useSetAtom(allBlueprintsAtom)

  useEffect(() => {
    reload()
  }, [])

  return (
    <Suspense
      fallback={
        <BlueprintsGrid ids={[]}>
          <PageHeader>Explore Blueprints</PageHeader>
        </BlueprintsGrid>
      }
    >
      <Content />
    </Suspense>
  )
}
