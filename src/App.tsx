import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { TitlePage } from '@pages/TitlePage'
import { MenuPage } from '@pages/MenuPage'
import { GameplayPage } from '@pages/GameplayPage'
import { MapEditorPage } from '@pages/MapEditorPage'
import './App.css'
import { MapPlayPage } from '@pages/MapPlayPage.tsx';

function AppContent() {
  const location = useLocation()

  const getScreenClass = () => {
    if (location.pathname === '/menu') return 'is-menu'
    if (location.pathname === '/gameplay') return 'is-gameplay'
    if (location.pathname === '/map-editor') return 'is-map-editor'
    return 'is-title'
  }

  return (
    <main className={`app-shell ${getScreenClass()}`}>
      <Routes>
        <Route path="/" element={<TitlePage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/gameplay" element={<GameplayPage />} />
        <Route path="/gameplay/level1" element={<GameplayPage />} />
        <Route path="/map-editor" element={<MapEditorPage />} />
        <Route path="/map-play" element={<MapPlayPage />} />
      </Routes>
    </main>
  )
}

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  )
}

export default App
