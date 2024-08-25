import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import { MainContainer } from './components/MainContainer'
import './index.css'
import { BattleStage } from './components/BattleStage'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MainContainer>
      <Router>
        <BattleStage />
      </Router>
    </MainContainer>
  </StrictMode>
)
