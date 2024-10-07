import { ReactNode } from 'react'

export interface DialogCommonPanel {
  children: ReactNode
  title?: string
  closeLabel?: string
  onClose: (data: any) => void
}

export function DialogCommonPanel({
  title,
  children,
  closeLabel,
  onClose,
}: DialogCommonPanel) {
  return (
    <div className='px-5 pt-5 w-full overflow-y-auto overflow-x-hidden'>
      <div className='pointer-events-auto p-5 rounded-xl bg-gray-700 max-w-sm mx-auto w-full flex flex-col gap-5 items-center'>
        {title && (
          <div className='flex flex-col gap-2'>
            <p className='text-xl'>{title}</p>
          </div>
        )}
        {children}
      </div>
      <div className='w-full flex items-center justify-center'>
        <button
          className='pointer-events-auto text-center p-5'
          onClick={() => {
            onClose(null)
          }}
        >
          {closeLabel || 'Close'}
        </button>
      </div>
    </div>
  )
}
