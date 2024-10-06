import { useState } from 'react'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import sampleStoryAtom from '../atoms/sampleStoryAtom'
import { MenuCardProps, storyDataType } from '../types'
import { DialogStoryForm } from './DialogStoryForm'

const MenuCard = ({ label, bgImage, onClickHandler = () => {}, disabled = false }: MenuCardProps) => {
  return <div className={cn("relative group h-64 bg-center bg-cover border-gray-600 rounded-lg border-4 hover:border-gray-200 overflow-hidden transition-all duration-500 group-hover:rounded-3xl", { "opacity-50 cursor-not-allowed": disabled }, { "cursor-pointer": !disabled })} style={{ backgroundImage: `url(${bgImage})` }}
    onClick={onClickHandler}>
        <div className="absolute inset-0 bg-black bg-opacity-25 group-hover:backdrop-blur-sm backdrop-blur-none transition-all duration-500"></div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <span className="text-white text-lg font-bold">{label}</span>
        </div>
      </div>
}
export const CraftStory = () => {
  // using this as a temporary initial record for demo purpose
  const sampleStoryData = useAtomValue(sampleStoryAtom)

  const [step, setStep] = useState(0)
  const [storyData, setStoryData] = useState<storyDataType[]>([])
  const [type, setType] = useState('dialog')

  const initializeStory = () => {
    setStep(1)
  }

  return (<div className="content flex h-full w-full justify-center items-start">
    {
      step === 0 && <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 w-full">
      <MenuCard label="Dialog" bgImage="/images/dialog.webp" onClickHandler={() => initializeStory()} />
      <MenuCard label="Puzzle" bgImage="/images/puzzle.webp" disabled={true} />
      <MenuCard label="Combat" bgImage="/images/combat.jpg" disabled={true} />
    </div>
    }
    {
      step !== 0 && <div className="flex flex-col">
        <DialogStoryForm
          step={step}
          setStep={setStep}
          storyData={storyData}
          setStoryData={setStoryData}
          type={type}
          setType={setType}
        />
      </div>
    }
  </div>)
}
