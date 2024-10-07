import { useEffect, useState } from 'react'
import { SampleStoryDataType } from '../types'
import cn from 'classnames'
import { useAtomValue } from 'jotai'
import sampleStoryAtom from '../atoms/sampleStoryAtom'
import { StoryPreview } from './StoryPreview'

export interface DialogStoryFormProps {
  step: number
  setStep: (step: number) => void
  type: string
  setType: (type: string) => void
}

export const DialogStoryForm = ({
  step,
  setStep,
  type,
  setType
}: DialogStoryFormProps): JSX.Element => {
  // using this as a temporary initial record for demo purpose
  const sampleStoryData = useAtomValue(sampleStoryAtom)

  // prefill the form with the sample record
  const [dialog, setDialog] = useState<string>(sampleStoryData?.content[0]?.dialog || '')
  const [avatar, setAvatar] = useState<string>(sampleStoryData?.content[0]?.avatar || '')
  const [avatarPosition, setAvatarPosition] = useState<string>(sampleStoryData?.content[0]?.avatarPosition || '')
  const [reward, setReward] = useState<string>(sampleStoryData?.content[0]?.reward || '')
  const [previewData, setPreviewData] = useState<SampleStoryDataType>(sampleStoryData)

  const handleNextStep = (type = 'dialog') => {
    try {
      if (!dialog || !avatar || !avatarPosition) return
      const nextStep = step + 1
      setDialog(sampleStoryData?.content[nextStep]?.dialog ?? '')
      setAvatar(sampleStoryData?.content[nextStep]?.avatar ?? '')
      setAvatarPosition(sampleStoryData?.content[nextStep]?.avatarPosition ?? '')
      setReward(sampleStoryData?.content[nextStep]?.reward ?? '')
      setStep(nextStep)
      setType(type)
    } catch (error) {
      console.error('Error in handleNextStep', error)
    }
  }

  const handleCreateStory = () => {
    window.location.reload()
  }

  useEffect(() => {
    const newDialog = { dialog, avatar, avatarPosition, type }
    const previewData = {name: "Preview", type: type, content: [newDialog]}
    setPreviewData(previewData)
  }, [dialog, avatar, avatarPosition, type])

  return (
    <div className='flex flex-col w-lg overflow-hidden gap-4'>
      <div className='flex gap-4'>
        <div className='flex flex-col gap-4 pt-6'><StoryPreview sampleStoryData={previewData} label="Dialog Preview" /></div>
        <div className='flex flex-col gap-4'>
            <h2 className='text-xl font-bold text-center mt-6'>Add a {type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <label className='px-1 text-xs uppercase tracking-wider opacity-50 flex items-center' htmlFor='avatar'>
                  Avatar URL
                </label>
                <div className='mt-1'>
                  <input
                    type='file'
                    name='avatar'
                    id='avatar'
                    className="block w-full text-lg border rounded border-gray-500 cursor-pointer text-gray-400 bg-black/20 placeholder-gray-400"
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
                          'rounded px-4 text-lg',
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
                          'rounded px-4 text-lg',
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
        </div>
      </div>
    </div>
  )
}
