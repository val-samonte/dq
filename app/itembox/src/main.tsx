import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'
import { WalletAdapter } from './components/WalletAdapter.tsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import App from './components/App.tsx'

import './index.css'
import { CreateBlueprintPage } from './components/CreateBlueprintPage.tsx'
import { UserPage } from './components/UserPage.tsx'
import cn from 'classnames'
import { BlueprintPage } from './components/BlueprintPage.tsx'
import { CreateRecipePage } from './components/CreateRecipePage.tsx'
import { AllDialogs } from './components/dialogs/AllDialogs.tsx'
import { CraftItemPage } from './components/CraftItemPage.tsx'

const Reload = () => {
  return (
    <div className='flex items-center justify-center flex-col absolute inset-0 gap-5'>
      <span>An error occurred. Please refresh the page.</span>

      <button
        className={cn(
          'w-fit',
          'flex items-center gap-3',
          'rounded px-4 py-3 text-lg',
          'bg-gray-600/50'
        )}
        onClick={() => {
          window.location.reload()
        }}
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
            <Route path={'/user/:userId'} element={<UserPage />} />
            <Route path={'/blueprints'} element={<CreateBlueprintPage />} />
            <Route
              path={'/blueprints/:blueprintId'}
              element={<BlueprintPage />}
            />
            <Route
              path={'/blueprints/:blueprintId/new-recipe'}
              element={<CreateRecipePage />}
            />
            <Route
              path={'/blueprints/:blueprintId/recipes/:recipeId'}
              element={<CraftItemPage />}
            />
          </Routes>
          <AllDialogs />
        </Router>
      </WalletAdapter>
    </ErrorBoundary>
  </StrictMode>
)
