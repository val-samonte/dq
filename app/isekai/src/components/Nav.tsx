import { FilePlus, HouseLine, Wallet } from '@phosphor-icons/react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import cn from 'classnames'
import { useUserWallet } from '../atoms/userWalletAtom'
import { trimAddress } from '../utils/trimAddress'
import { Link } from 'react-router-dom'

export function Nav() {
  const wallet = useUserWallet()
  const { setVisible } = useWalletModal()

  return (
    <div className={cn('bg-stone-700 w-full h-16 sticky top-0 z-10 flex-none')}>
      <div
        className={cn(
          'px-2 gap-2 md:px-5',
          'w-full h-full max-w-7xl mx-auto flex items-center justify-between'
        )}
      >
        <div className='flex-auto flex items-center gap-2'>
          <Link to={'/'}>
            <img
              src='/logo.png'
              alt='Itembox'
              className='w-16 h-16 object-contain aspect-square'
            />
          </Link>
          <input
            className={cn(
              'hidden sm:flex',
              'items-center gap-3',
              'rounded px-6 py-3 text-lg',
              'bg-black/20 w-full'
            )}
            type='text'
            placeholder='Search by address, author or Blueprints'
          />
        </div>
        <div className='flex-none'>
          <Link
            to='/blueprints/link'
            className={cn(
              'w-fit',
              'flex items-center gap-3',
              'rounded pr-4 pl-4 py-3 text-lg',
              'bg-stone-600/50'
            )}
          >
            <FilePlus size={28} />
          </Link>
        </div>
        <div className='flex-none'>
          <Link
            to={`/`}
            className={cn(
              'w-fit',
              'flex items-center gap-3',
              'rounded pr-4 pl-4 py-3 text-lg',
              'bg-stone-600/50'
            )}
          >
            <HouseLine size={28} />
          </Link>
        </div>
        <div className='flex-none'>
          <button
            onClick={() => {
              if (!wallet?.publicKey) {
                setVisible(true)
              } else {
                wallet.disconnect()
              }
            }}
            className={cn(
              'w-fit',
              'flex items-center gap-3',
              'rounded pr-4 md:pr-6 pl-4 py-3 text-lg',
              'bg-stone-600/50'
            )}
          >
            <Wallet size={28} />
            {wallet?.publicKey ? (
              <span className='text-sm'>
                {trimAddress(wallet.publicKey.toBase58())}
              </span>
            ) : (
              <span className='hidden md:inline'>Connect Wallet</span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
