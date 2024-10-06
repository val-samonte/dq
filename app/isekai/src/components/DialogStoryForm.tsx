import { useState } from 'react'
import { storyDataType } from '../types'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import sampleStoryAtom from '../atoms/sampleStoryAtom'

export interface DialogStoryFormProps {
  step: number
  setStep: (step: number) => void
  type: string
  setType: (type: string) => void
  storyData: storyDataType[]
  setStoryData: (storyData: storyDataType[]) => void
}

export const DialogStoryForm = ({
  step,
  setStep,
  type,
  setType,
  storyData,
  setStoryData,
}: DialogStoryFormProps): JSX.Element => {
  // using this as a temporary initial record for demo purpose
  const sampleStoryData = useAtomValue(sampleStoryAtom)

  // prefill the form with the sample record
  const [dialog, setDialog] = useState<string>(sampleStoryData?.[0]?.dialog || '')
  const [avatar, setAvatar] = useState<string>(sampleStoryData?.[0]?.avatar || '')
  const [avatarPosition, setAvatarPosition] = useState<string>(sampleStoryData?.[0]?.avatarPosition || '')
  const [reward, setReward] = useState<string>(sampleStoryData?.[0]?.reward || '')

  const handleNextStep = (type = 'dialog') => {
    try {
      if (!dialog || !avatar || !avatarPosition) return

      // TODO: add validation
      const newDialog = { dialog, avatar, avatarPosition, type }

      const newStoryData = [...storyData, newDialog]
      const nextStep = step + 1
      setStoryData(newStoryData)
      setDialog(sampleStoryData?.[nextStep]?.dialog ?? '')
      setAvatar(sampleStoryData?.[nextStep]?.avatar ?? '')
      setAvatarPosition(sampleStoryData?.[nextStep]?.avatarPosition ?? '')
      setReward(sampleStoryData?.[nextStep]?.reward ?? '')
      setStep(nextStep)
      setType(type)
    } catch (error) {
      console.error('Error in handleNextStep', error)
    }
  }

  const handleCreateStory = () => {
    window.location.reload()
  }

  return (
    <div className='flex flex-col w-lg overflow-hidden gap-4'>
        <h2 className='text-xl font-bold text-center mt-4'>ADD A {type.toUpperCase()}</h2>
        <div className='flex flex-col gap-2'>
          <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center' htmlFor='avatar'>
            Avatar URL
          </label>
          <div className='mt-1'>
            <input
              type='text'
              name='avatar'
              id='avatar'
              className={cn(
                    'flex items-center gap-3',
                    'rounded px-4 py-3 text-lg',
                    'bg-black/20 w-full'
              )}
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
            />
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center' htmlFor='avatar-position'>
            Avatar Position
          </label>
          <div className='mt-1'>
            <select
              id='avatar-position'
              name='avatar-position'
              className={cn(
                    'flex items-center gap-3',
                    'rounded px-4 py-3 text-lg',
                    'bg-black/20 w-full'
                  )}
              value={avatarPosition}
              onChange={(e) => setAvatarPosition(e.target.value)}
            >
              <option value=''>Select an option</option>
              <option value='left'>Left</option>
              <option value='right'>Right</option>
            </select>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center' htmlFor='dialog'>
            Dialog
          </label>
          <div className='mt-1'>
            <textarea
              id='dialog'
              name='dialog'
              rows={3}
              className={cn(
                    'block gap-3',
                    'rounded px-4 py-3 text-lg',
                    'bg-black/20 w-full h-[300px]'
                  )}
              value={dialog}
              onChange={(e) => setDialog(e.target.value)}
            />
          </div>
        </div>
        {type === 'reward' && (
        <div className='flex flex-col gap-2'>
          <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center' htmlFor='avatar-position'>
            Reward
          </label>
          <div className='mt-1'>
            <select
              id='avatar-position'
              name='avatar-position'
              className={cn(
                    'flex items-center gap-3',
                    'rounded px-4 py-3 text-lg',
                    'bg-black/20 w-full'
                  )}
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            >
              <option value=''>Select an option</option>
              <option value='item_1_address'>Item 1</option>
              <option value='item_2_address'>Item 2</option>
            </select>
          </div>
        </div>)
        }
        <input type='hidden' name='type' value={type} />
      {type === 'dialog' && <div className='flex w-full justify-end gap-4'>
        <button
          className='flex w-full items-center gap-4 rounded pr-6 pl-4 py-3 text-lg border-2 border-transparent bg-stone-600/50 text-center justify-center'
          onClick={() => handleNextStep('dialog')}
        >
          Add More Dialog
        </button>
        <button
          className='flex w-full items-center gap-4 rounded pr-6 pl-4 py-3 text-lg border-2 border-transparent bg-stone-600/50 text-center justify-center'
          onClick={() => handleNextStep('reward')}
        >
          Assign Reward (Final step)
        </button>
      </div>}
      {type === 'reward' && <div className='flex w-full justify-end gap-4'>
        <button
          className='flex w-full items-center gap-4 rounded pr-6 pl-4 py-3 text-lg border-2 border-transparent bg-stone-600/50 text-center justify-center'
          onClick={handleCreateStory}
        >
          Craft Story
        </button>
      </div>}

      </div>
  )
}
