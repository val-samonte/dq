import cn from "classnames"
import { FilePlus } from "@phosphor-icons/react"
import { SideBar } from "./SideBar"
import { useState } from "react"
import { BpModal } from "./BpModal"

export const ListBlueprintsPage = () => {
  const [showBpList, setShowBpList] = useState(false)
  const hideBpModal = () => {
    setShowBpList(false)
  }
  return (<div className="absolute inset-0 h-full flex flex-col overflow-y-auto overflow-x-hidden">
    {showBpList && <BpModal handleClose={hideBpModal} />}
    <div className="content flex h-full">
      <SideBar />
      <div className="inner-content flex flex-col w-full justify-center items-center gap-4">
        <span className='opacity-50 text-lg'>
          You do not have any imported Blueprints yet!
        </span>
        <button
          className={cn(
            'w-fit',
            'flex items-center gap-3',
            'rounded pr-6 pl-4 py-3 text-lg',
            'border-2 border-amber-300/50',
            'bg-gradient-to-t from-amber-800 to-yellow-800'
          )}
          onClick={() => setShowBpList(true)}
          data-modal-target="bp-modal" data-modal-toggle="bp-modal"
        >
        <FilePlus size={24} />
        Import a Blueprint
        </button>
      </div>
    </div>
  </div>)
}
