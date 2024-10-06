import cn from "classnames"
import { SideBar } from "./SideBar"
import { useState } from "react"
import { FilePlus } from "@phosphor-icons/react"
import { CraftStory } from "./CraftStory"
import sampleStoryAtom from '../atoms/sampleStoryAtom'
import { useAtomValue } from "jotai"
import { StoryThumbnail } from "./StoryThumbnail"

export const CreateStoryPage = () => {
  const [showStoryBoard, setShowStoryBoard] = useState(false)
  const sampleStoryData = useAtomValue(sampleStoryAtom)
  const sampleArray = [sampleStoryData]

  return (<div className="absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden">
    <div className="content flex h-full">
      <SideBar />
      {showStoryBoard ? <CraftStory /> : <div className="inner-content flex flex-col w-full justify-center items-center gap-4">
        <button
          className={cn(
            'w-fit',
            'flex items-center gap-3',
            'rounded pr-6 pl-4 py-3 text-lg',
            'border-2 border-amber-300/50',
            'bg-gradient-to-t from-amber-800 to-yellow-800'
          )}
          onClick={() => setShowStoryBoard(true)}
          data-modal-target="bp-modal" data-modal-toggle="bp-modal"
        >
          <FilePlus size={24} />
          Create a Story
        </button>
        <div className="grid grid-cols-4 md:grid-cols-3 gap-6 p-6 w-full">
          {sampleArray.map((story) => {
            return <StoryThumbnail key={story.name} name={story.name} />
          })}
        </div>
      </div>}
    </div>
  </div>)
}
