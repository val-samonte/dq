
export interface MenuCardProps {
  label: string
  bgImage: string
  onClickHandler?: () => void
  disabled?: boolean
}

export type storyDataType = {
  dialog: string
  avatar: string
  avatarPosition: string
  type: string
}