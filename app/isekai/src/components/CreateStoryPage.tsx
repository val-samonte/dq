import cn from "classnames"
import { Nav } from "./Nav"
import { SideBar } from "./SideBar"
import { useState } from "react"
import { FilePlus } from "@phosphor-icons/react"
import { CraftStory } from "./CraftStory"

export const CreateStoryPage = () => {
  const [showStoryBoard, setShowStoryBoard] = useState(false)

  return (<div className="absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden">
    <Nav />
    <div className="content flex h-full">
      <SideBar />
      {showStoryBoard ? <CraftStory /> : <div className="inner-content flex flex-col w-full justify-center items-center gap-4">
        <span className='opacity-50 text-lg'>
          You do not have any crafted story yet!
        </span>
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
      </div>}
    </div>
  </div>)
}
