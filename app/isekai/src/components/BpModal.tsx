import { X } from '@phosphor-icons/react'
import { useAtomValue } from 'jotai'
import { allBlueprintsAtom } from '../atoms/allBlueprintsAtom'
interface BpModalProps {
  handleClose: () => void
}
export const BpModal = ({ handleClose }: BpModalProps) => {
  const blueprints = useAtomValue(allBlueprintsAtom)
  return (
    <div
      aria-hidden='true'
      className='modal-backdrop overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full'
    >
      <div className='relative p-4 w-full max-w-md max-h-full'>
        <div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
          <div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
            <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
              Select a Blueprint
            </h3>
            <X size={16} className='cursor-pointer' onClick={handleClose} />
          </div>
          <div className='p-4 md:p-5'>
            <p>BP list here</p>
          </div>
        </div>
      </div>
    </div>
  )
}