import { Routes, Route, useLocation } from 'react-router-dom'
import { TitlePage }    from '@pages/TitlePage'
import { MenuPage }     from '@pages/MenuPage'
import { GameplayPage } from '@pages/GameplayPage'
import { RulesPage }    from '@pages/RulesPage'
import { OptionsPage }  from '@pages/OptionsPage'
import { ROUTES }       from '@services/game/flowService'
import './App.css'

function App() {
  const { pathname } = useLocation()

  const screenClass =
    pathname === ROUTES.gameplay ? 'is-gameplay' :
    pathname === ROUTES.menu     ? 'is-menu'     :
                                   'is-title'

  return (
    <main className={`app-shell ${screenClass}`}>
      <Routes>
        <Route path={ROUTES.title}    element={<TitlePage />}    />
        <Route path={ROUTES.menu}     element={<MenuPage />}     />
        <Route path={ROUTES.gameplay} element={<GameplayPage />} />
        <Route path={ROUTES.rules}    element={<RulesPage />}    />
        <Route path={ROUTES.options}  element={<OptionsPage />}  />
        {/* Fallback */}
        <Route path="*" element={<TitlePage />} />
      </Routes>
    </main>
  )
}

export default App
