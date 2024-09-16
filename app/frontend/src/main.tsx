import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainContainer } from './components/MainContainer'
import { HomeScreen } from './components/HomeScreen'
import './index.css'
import { Tutorial } from './components/Tutorial'
import { TutorialBasic } from './components/TutorialBasic'
import { Practice } from './components/Practice'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <MainContainer>
        <Routes>
          <Route path={'/'} element={<HomeScreen />} />
          <Route path={'/tutorial'} element={<Tutorial />} />
          <Route path={'/tutorial/basics'} element={<TutorialBasic />} />
          <Route path={'/practice'} element={<Practice />} />
          <Route path={'/arena'} element={<Tutorial />} />
        </Routes>
      </MainContainer>
    </Router>
  </StrictMode>
)
