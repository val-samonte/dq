import { ItemCrafted } from './ItemCrafted'
import { MessageDialog } from './MessageDialog'
import { MintItem } from './MintItem'
import { RecipeCreated } from './RecipeCreated'

export function AllDialogs() {
  return (
    <>
      <RecipeCreated />
      <MintItem />
      <MessageDialog />
      <ItemCrafted />
    </>
  )
}
