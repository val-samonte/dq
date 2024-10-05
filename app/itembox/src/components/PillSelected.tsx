import cn from 'classnames'
import { NumberInput } from './NumberInput'
import { Menu, MenuButton } from '@headlessui/react'
import { CaretDown, CheckFat, Fire, HandDeposit } from '@phosphor-icons/react'
import { ConsumptionMethodMenuItems } from './ConsumptionMethodMenuItems'

export interface PillSelectedProps {
  amount: string
  decimals: number
  consumeMethod: 'retain' | 'burn' | 'transfer'
  nonFungible?: boolean
  onAmountChange: (value: string) => void
  onConsumeMethodChange: (value: 'retain' | 'burn' | 'transfer') => void
}

export function PillSelected({
  amount,
  decimals,
  consumeMethod,
  nonFungible,
  onAmountChange,
  onConsumeMethodChange,
}: PillSelectedProps) {
  return (
    <div className='grid lg:hidden grid-cols-2 gap-2 px-2 pb-2 text-sm'>
      {nonFungible ? (
        <div className='flex-1 bg-black/20 rounded px-2 py-1'>
          1 <span className='text-gray-400 ml-2'>(Fixed)</span>
        </div>
      ) : (
        <NumberInput
          decimals={decimals}
          className='flex-1 bg-black/20 rounded px-2 py-1'
          placeholder='Amount'
          value={amount}
          onChange={onAmountChange}
        />
      )}
      <Menu>
        <MenuButton
          className={cn(
            'flex-1 bg-black/20 rounded p-1 flex gap-2 items-center justify-center'
          )}
        >
          <span className='flex items-center gap-2'>
            {
              {
                retain: (
                  <>
                    <CheckFat size={20} />
                    Require <span className='hidden lg:inline'>Only</span>
                  </>
                ),
                burn: (
                  <>
                    <Fire size={20} />
                    Burn
                  </>
                ),
                transfer: (
                  <>
                    <HandDeposit size={20} />
                    Transfer
                  </>
                ),
              }[consumeMethod]
            }
          </span>
          <CaretDown size={20} className='text-gray-600' />
        </MenuButton>
        <ConsumptionMethodMenuItems onSelect={onConsumeMethodChange} />
      </Menu>
    </div>
  )
}
