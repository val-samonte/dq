import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'
import { userAssetsAtom } from '../atoms/userAssetsAtom'
import { Suspense, useEffect, useMemo } from 'react'
import { Pill } from './Pill'
import { useUserWallet } from '../atoms/userWalletAtom'
import { PillSkeleton } from './PillSkeleton'

export interface NonFungibleInventoryProps {
  selectMode: 'none' | 'single' | 'multiple'
  filters?: string[]
  onSelection?: (selectedItems: any[]) => void
}

export const nonFungibleSelectionsAtom = atom<string[]>([])

export function Content({
  filters,
  selectMode,
  onSelection,
}: NonFungibleInventoryProps) {
  const list = useAtomValue(userAssetsAtom)
  const [selectedItems, setSelectedItems] = useAtom(nonFungibleSelectionsAtom)

  const filteredList = useMemo(() => {
    if (!filters) return list
    return list.filter(
      (asset) => asset.blueprintId && filters.includes(asset.blueprintId)
    )
  }, [list, filters])

  useEffect(() => {
    onSelection?.(
      filteredList.filter((asset) => selectedItems.includes(asset.id))
    )
  }, [selectedItems, filteredList])

  return (
    <>
      {filteredList.map((asset) => (
        <Pill
          selected={selectedItems.includes(asset.id)}
          key={asset.id}
          {...asset}
          onClick={() => {
            const included = selectedItems.includes(asset.id)

            if (included) {
              setSelectedItems((items) => items.filter((i) => i !== asset.id))
            } else if (selectMode === 'single') {
              setSelectedItems([asset.id])
            } else {
              setSelectedItems((items) => [...items, asset.id])
            }
          }}
        />
      ))}
    </>
  )
}

export function NonFungibleInventory(props: NonFungibleInventoryProps) {
  const reload = useSetAtom(userAssetsAtom)
  const wallet = useUserWallet()

  useEffect(() => {
    reload()
  }, [props.filters, wallet])

  if (!wallet?.publicKey) {
    return (
      <>
        <PillSkeleton />
      </>
    )
  }

  return (
    <Suspense fallback={<PillSkeleton />}>
      <Content {...props} />
    </Suspense>
  )
}
