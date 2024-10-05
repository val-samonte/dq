import { useState } from 'react'
import cn from 'classnames'

const MenuCard = ({ label, bgImage, disabled = false }: { label: string, bgImage: string, disabled?: boolean }) => {
  return <div className={cn("relative group h-64 bg-center bg-cover cursor-pointer border-gray-600 rounded-lg border-4 hover:border-gray-200 overflow-hidden transition-all duration-500 group-hover:rounded-3xl", {"opacity-50 cursor-not-allowed": disabled})} style={{backgroundImage: `url(${bgImage})`}}>
        <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:backdrop-blur-sm backdrop-blur-none transition-all duration-500"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <span className="text-white text-lg font-bold">{label}</span>
        </div>
      </div>
}
export const CraftStory = () => {
  const [step, setStep] = useState(1)

  return (<div className="content flex h-full w-full">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 w-full">
      <MenuCard label="Dialog" bgImage="/images/dialog.webp" />
      <MenuCard label="Puzzle" bgImage="/images/puzzle.webp" disabled={true} />
      <MenuCard label="Combat" bgImage="/images/combat.jpg" disabled={true} />
    </div>
  </div>)
}
