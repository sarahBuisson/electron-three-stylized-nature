import { useEffect } from 'react'
import { isCloseKey } from '@services/game/inputService'
import type { Keybinds } from '@models/Keybinds'

interface RulesOverlayProps {
  open: boolean
  keybinds: Keybinds
  onClose: () => void
}

export function RulesOverlay({ open, keybinds, onClose }: RulesOverlayProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (isCloseKey(event.key, keybinds)) {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [keybinds, onClose, open])

  if (!open) {
    return null
  }

  return (
    <div className="rules-overlay" role="dialog" aria-modal="true">
      <div className="rules-panel">
        <h2>Regles</h2>
        <ul>
          <li>Entree/Espace: valider un bouton.</li>
          <li>Fleches ou W/S: naviguer dans le menu.</li>
          <li>Echap: fermer cette fenetre.</li>
        </ul>
        <button type="button" onClick={onClose}>
          Fermer
        </button>
      </div>
    </div>
  )
}


