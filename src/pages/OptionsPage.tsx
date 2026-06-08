import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@services/game/flowService'
import './OptionsPage.css'

export function OptionsPage() {
  const navigate = useNavigate()

  return (
    <div className="options-page">
      <div className="options-page__panel">
        <h2>Options</h2>
        <p className="options-page__placeholder">Options à venir...</p>
        <div className="options-page__actions">
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

