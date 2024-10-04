import { MenuItem, MenuItems, MenuSeparator } from '@headlessui/react'
import { CheckFat, Fire, HandDeposit } from '@phosphor-icons/react'
import cn from 'classnames'

export function ConsumptionMethodMenuItems({
  onSelect,
}: {
  onSelect: (method: string) => void
}) {
  return (
    <MenuItems
      anchor='bottom'
      className={cn(
        'flex flex-col bg-gray-700 rounded overflow-hidden',
        'shadow-lg border border-black/5'
      )}
    >
      <MenuItem>
        <button
          onClick={() => onSelect('transfer')}
          className='text-left flex flex-col px-3 py-2 gap-2 min-w-36 data-[focus]:bg-gray-600/20'
        >
          <div className='flex items-center gap-2'>
            <HandDeposit size={20} />
            Transfer
          </div>
          <p className='text-xs text-gray-400'>
            Ingredient will be deposited to the
            <br />
            Blueprint&apos;s treasury wallet.
          </p>
        </button>
      </MenuItem>
      <MenuSeparator className={'border-b border-black/5'} />
      <MenuItem>
        <button
          onClick={() => onSelect('burn')}
          className='text-left flex flex-col px-3 py-2 gap-2 min-w-36 data-[focus]:bg-gray-600/20'
        >
          <div className='flex items-center gap-2'>
            <Fire size={20} />
            Burn
          </div>
          <p className='text-xs text-gray-400'>
            Ingredient will be burned / discarded.
          </p>
        </button>
      </MenuItem>
      <MenuSeparator className={'border-b border-black/5'} />
      <MenuItem>
        <button
          onClick={() => onSelect('retain')}
          className='text-left flex flex-col px-3 py-2 gap-2 min-w-36 data-[focus]:bg-gray-600/20'
        >
          <div className='flex items-center gap-2'>
            <CheckFat size={20} />
            Require Only
          </div>
          <p className='text-xs text-gray-400'>
            Ingredient just needs to be present.
          </p>
          <p className='text-xs opacity-80 text-red-400'>WARNING</p>
          <p className='text-xs text-gray-400'>
            Do not use alone. Other ingredients <br />
            must be other than "Require Only".
          </p>
        </button>
      </MenuItem>
    </MenuItems>
  )
}
