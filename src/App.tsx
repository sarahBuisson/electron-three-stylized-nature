import { lazy, Suspense, useMemo, useState } from 'react'
import { GameplayPlaceholder } from '@components/gameplay/GameplayPlaceholder'
import { RulesOverlay } from '@components/ui/RulesOverlay'
import { TitleScreen } from '@components/ui/TitleScreen'
import type { MenuActionId } from '@config/menuConfig'
import { flowService } from '@services/game/flowService'
import { runMenuAction } from '@services/game/menuService'
import { storageService } from '@services/storage/storageService'
import { loggerService } from '@services/utils/loggerService'
import type { GameFlowState } from '@models/GameFlowState'
import './App.css'

const MainMenu3D = lazy(async () => {
  const module = await import('@components/menu/MainMenu3D')
  return { default: module.MainMenu3D }
})

function App() {
  const [screen, setScreen] = useState<GameFlowState>('title')
  const [rulesOpen, setRulesOpen] = useState(false)
  const [showGameplayMessage, setShowGameplayMessage] = useState(false)
  const keybinds = useMemo(() => storageService.getKeybinds(), [])

  const handleAction = (actionId: MenuActionId) => {
    runMenuAction(actionId, {
      onNewGame: () => {
        setShowGameplayMessage(true)
        loggerService.info('Nouvelle partie selectionnee')
      },
      onRules: () => setRulesOpen(true),
      onOptions: () => loggerService.info('Options a implementer'),
      onQuit: () => setScreen(flowService.goToTitle()),
    })
  }

  return (
    <main className={`app-shell ${screen === 'menu' ? 'is-menu' : 'is-title'}`}>
      {screen === 'title' && (
        <TitleScreen
          onStart={() => {
            setShowGameplayMessage(false)
            setRulesOpen(false)
            setScreen(flowService.goToMenu())
          }}
        />
      )}

      {screen === 'menu' && (
        <>
          <Suspense
            fallback={
              <div className="menu-loading" role="status" aria-live="polite">
                <span className="menu-loading__title">Chargement du menu 3D...</span>
                <span className="menu-loading__text">Preparation de la scene, des effets et des assets.</span>
              </div>
            }
          >
            <MainMenu3D keybinds={keybinds} onAction={handleAction} />
          </Suspense>
          <RulesOverlay open={rulesOpen} keybinds={keybinds} onClose={() => setRulesOpen(false)} />
          {showGameplayMessage && <GameplayPlaceholder />}
        </>
      )}
    </main>
  )
}

export default App
