import '@solana/wallet-adapter-react-ui/styles.css'
import { FC, ReactNode, Suspense, useEffect, useMemo, useRef } from 'react'
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { useAtomValue, useSetAtom } from 'jotai'
import { rpcEndpointAtom } from '../atoms/rpcEndpointAtom'
import { userWalletAtom } from '../atoms/userWalletAtom'

export const WalletInitializer: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const walletContextStateSerialized = useRef('')
  const walletContextState = useWallet()
  const setUserWalletContextState = useSetAtom(userWalletAtom)

  useEffect(() => {
    const serialized = JSON.stringify({
      wallet: walletContextState.wallet?.readyState,
      publicKey: walletContextState.publicKey,
      connected: walletContextState.connected,
      connecting: walletContextState.connecting,
      disconnecting: walletContextState.disconnecting,
    })

    if (walletContextStateSerialized.current !== serialized) {
      walletContextStateSerialized.current = serialized

      setUserWalletContextState(walletContextState)
    }
  }, [walletContextState, setUserWalletContextState])

  return <Suspense fallback={null}>{children}</Suspense>
}

export const WalletAdapter: FC<{ children: ReactNode }> = ({ children }) => {
  const rpc = useAtomValue(rpcEndpointAtom)

  const wallets = useMemo(
    () => [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rpc]
  )

  return (
    <ConnectionProvider endpoint={rpc}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletInitializer>{children}</WalletInitializer>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
