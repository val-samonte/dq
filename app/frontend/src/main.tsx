import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { MainContainer } from './components/MainContainer'
import './index.css'
import { Tutorial } from './components/Tutorial'
import { TutorialBasic } from './components/TutorialBasic'
import { Practice } from './components/Practice'
import { Tavern } from './components/Tavern'
import { Barracks } from './components/Barracks'
import { HomeScreenV2 } from './components/HomeScreenV2'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <MainContainer>
        <Routes>
          <Route path={'/'} element={<HomeScreenV2 />} />
          <Route path={'/tutorial'} element={<Tutorial />} />
          <Route path={'/tutorial/basics'} element={<TutorialBasic />} />
          <Route path={'/practice'} element={<Practice />} />
          <Route path={'/arena'} element={<Tutorial />} />
          <Route path={'/tavern'} element={<Tavern />} />
          <Route path={'/barracks'} element={<Barracks />} />
        </Routes>
      </MainContainer>
    </Router>
  </StrictMode>
)
