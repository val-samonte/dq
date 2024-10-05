import { Suspense } from 'react'

function Content() {
  return null
}

export function CraftItem() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  )
}
