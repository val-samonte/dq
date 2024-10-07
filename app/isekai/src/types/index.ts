
export interface MenuCardProps {
  label: string
  bgImage: string
  onClickHandler?: () => void
  disabled?: boolean
}

export type StoryDataType = {
  dialog: string
  avatar: string
  avatarPosition: string
  type: string
}

export type SampleStoryDataType = {
    name: string;
    type: string;
    content: ({
        dialog: string;
        avatar: string;
        avatarPosition: string;
        type: string;
        reward?: undefined;
    } | {
        dialog: string;
        avatar: string;
        avatarPosition: string;
        type: string;
        reward: string;
    })[];
}