import { CardsThree, CirclesThreePlus, Wallet } from '@phosphor-icons/react'
import { useUserWallet } from '../atoms/userWalletAtom'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { trimAddress } from '../utils/trimAddress'
import cn from 'classnames'

export function SideBar() {
  const wallet = useUserWallet()
  const { setVisible } = useWalletModal()

  return (
    <div className="fixed inset-y-0 left-0 z-1 w-[320px] overflow-y-auto transition duration-300 transform bg-stone-900 lg:translate-x-0 lg:static lg:inset-0 h-full flex flex-col justify-between">
    <div>
      <div className="flex items-center justify-center mt-8">
          <div className="flex items-center">
              <span className="mx-2 text-2xl font-semibold text-white">Isekai Dashboard</span>
          </div>
      </div>

      <nav className="mt-10">
          <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-stone-700 hover:bg-opacity-25 hover:text-gray-100" href="/stories">
              <CirclesThreePlus size={32} />

              <span className="mx-3">Created Stories</span>
          </a>

          <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-stone-700 hover:bg-opacity-25 hover:text-gray-100" href="/blueprints">
              <CardsThree size={32} />

              <span className="mx-3">Imported Blueprints</span>
          </a>
      </nav>
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
          'w-full',
          'flex items-center gap-3',
          'pr-6 pl-4 py-3 text-lg',
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
  )
}