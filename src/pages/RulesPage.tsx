import { useNavigate } from 'react-router-dom'
import { storageService } from '@services/storage/storageService'
import { isCloseKey } from '@services/game/inputService'
import { useEffect } from 'react'
import { ROUTES } from '@services/game/flowService'
import './RulesPage.css'

export function RulesPage() {
  const navigate = useNavigate()
  const keybinds = storageService.getKeybinds()

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isCloseKey(e.key, keybinds)) navigate(-1)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [keybinds, navigate])

  return (
    <div className="rules-page">
      <div className="rules-page__panel">
        <h2>Règles</h2>
        <ul>
          <li><kbd>Entrée</kbd> / <kbd>Espace</kbd> — valider un bouton</li>
          <li><kbd>↑</kbd> <kbd>↓</kbd> ou <kbd>W</kbd> <kbd>S</kbd> — naviguer dans le menu</li>
          <li><kbd>Échap</kbd> — fermer cette fenêtre</li>
          <li><kbd>WASD</kbd> / <kbd>ZQSD</kbd> — déplacer le personnage</li>
          <li><kbd>Espace</kbd> — sauter</li>
          <li><kbd>M</kbd> — basculer mode caméra (Manuel / Auto)</li>
          <li><kbd>P</kbd> — prendre un snapshot</li>
        </ul>
        <div className="rules-page__actions">
          <button type="button" onClick={() => navigate(-1)}>
            ← Retour
          </button>
          <button type="button" onClick={() => navigate(ROUTES.menu)}>
            Menu principal
          </button>
        </div>
      </div>
    </div>
  )
}

