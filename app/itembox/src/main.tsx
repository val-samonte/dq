import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { WalletAdapter } from './atoms/WalletAdapter.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './components/App.tsx'

import './index.css'
import { CreateBlueprintPage } from './components/CreateBlueprintPage.tsx'

const Reload = () => {
  return (
    <div className='flex items-center justify-center flex-col absolute inset-0 gap-2'>
      <span>An error occurred. Please refresh the page.</span>
      <button
        className='px-3 py-2 bg-amber-300/10'
        onClick={() => window.location.reload()}
      >
        Refresh
      </button>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallback={<Reload />}>
      <WalletAdapter>
        <Router>
          <Routes>
            <Route path={'/'} element={<App />} />
            <Route path={'/blueprints'} element={<CreateBlueprintPage />} />
          </Routes>
        </Router>
      </WalletAdapter>
    </ErrorBoundary>
  </StrictMode>
)
