import { useAtom } from 'jotai'
import { userAssetsAtom } from '../atoms/userAssetsAtom'
import { useEffect, useMemo, useState } from 'react'
import { Pill } from './Pill'

export interface NonFungibleInventoryProps {
  selectMode: 'none' | 'single' | 'multiple'
  filters?: string[]
  onSelection?: (selectedItems: any[]) => void
}

export function NonFungibleInventory({
  filters,
  selectMode,
  onSelection,
}: NonFungibleInventoryProps) {
  const [list, reload] = useAtom(userAssetsAtom)
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  useEffect(() => {
    reload()
  }, [filters])

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
          key={asset.id}
          {...asset}
          selected={selectedItems.includes(asset.id)}
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
