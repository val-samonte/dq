import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { WalletAdapter } from './atoms/WalletAdapter.tsx'
import App from './components/App.tsx'
import './index.css'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { ListBlueprintsPage } from './components/ListBlueprintsPage.tsx'
import { ImportBpPage } from './components/ImportBpPage.tsx'
import { CreateStoryPage } from './components/CreateStoryPage.tsx'
import { ShowStoryPage } from './components/ShowStoryPage.tsx'

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
            <Route path={'/story/new'} element={<CreateStoryPage />} />
            <Route path={'/story/:storyId'} element={<ShowStoryPage />} />
            <Route path={'/stories'} element={<CreateStoryPage />} />
            <Route path={'/blueprints'} element={<ListBlueprintsPage />} />
            <Route path={'/:blueprintAddress/import'} element={<ImportBpPage />} />
          </Routes>
        </Router>
      </WalletAdapter>
    </ErrorBoundary>
  </StrictMode>
)
