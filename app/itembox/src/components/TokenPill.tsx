import cn from 'classnames'
import { trimAddress } from '../utils/trimAddress'
import { NumberInput } from './NumberInput'
import { Menu, MenuButton } from '@headlessui/react'
import { CaretDown, CheckFat, Fire, HandDeposit } from '@phosphor-icons/react'
import { ConsumptionMethodMenuItems } from './ConsumptionMethodMenuItems'

export interface TokenPillProps {
  id: string
  name: string
  image: string | null
  symbol: string
  selected: boolean
  amount: string
  decimals: number
  consumeMethod: 'retain' | 'burn' | 'transfer'
  onClick: () => void
  onAmountChange: (value: string) => void
  onConsumeMethodChange: (value: 'retain' | 'burn' | 'transfer') => void
}

export function TokenPill({
  id,
  name,
  image,
  symbol,
  selected,
  amount,
  decimals,
  consumeMethod,
  onClick,
  onAmountChange,
  onConsumeMethodChange,
}: TokenPillProps) {
  return (
    <div
      className={cn(
        'rounded-lg bg-black/10',
        'border-2',
        'flex flex-col',
        selected ? 'border-green-400/50' : 'border-transparent'
      )}
    >
      <div className='flex p-2 gap-5'>
        <button
          onClick={onClick}
          className='flex-none rounded w-20 h-20 bg-black/20 overflow-hidden'
        >
          {image && (
            <img
              src={image}
              alt={symbol}
              className='w-full h-full aspect-square object-contain'
            />
          )}
        </button>
        <div className='flex flex-col gap-1 justify-center'>
          <button className='text-left' onClick={onClick}>
            {name}
          </button>
          <div className='flex flex-wrap gap-x-3'>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-600'>Mint</span>
              <span className='text-gray-400'>{trimAddress(id)}</span>
            </div>
            <div className='flex text-xs gap-2'>
              <span className='text-gray-600'>Symbol</span>
              <span className='text-gray-400'>{symbol}</span>
            </div>
          </div>
        </div>
      </div>
      {/* MOVE TO CHILDREN */}
      {selected && (
        <div className='grid lg:hidden grid-cols-2 gap-2 px-2 pb-2 text-sm'>
          <NumberInput
            min={1}
            step={1}
            decimals={decimals}
            className='flex-1 bg-black/20 rounded px-2 py-1'
            placeholder='Amount'
            value={amount}
            onChange={onAmountChange}
          />
          <Menu>
            <MenuButton
              className={cn(
                'flex-1 bg-black/20 rounded pl-1 pr-2 py-1 flex gap-2 items-center justify-center'
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
      )}
    </div>
  )
}
