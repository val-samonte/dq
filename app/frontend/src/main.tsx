import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { MainContainer } from './components/MainContainer'
import { HomeScreen } from './components/HomeScreen'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainContainer>
      <Router>
        <HomeScreen />
      </Router>
    </MainContainer>
  </StrictMode>
)
