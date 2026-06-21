import { lazy, Suspense, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RulesOverlay } from '@components/ui/RulesOverlay'
import type { MenuActionId } from '@config/menuConfig'
import { storageService } from '@services/storage/storageService'
import { loggerService } from '@services/utils/loggerService'

const MainMenuThree = lazy(async () => {
  const module = await import('@components/menu/MainMenuThree')
  return { default: module.MainMenuThree }
})

export function MenuPage() {
  const navigate = useNavigate()
  const [rulesOpen, setRulesOpen] = useState(false)
  const keybinds = useMemo(() => storageService.getKeybinds(), [])

  const handleAction = (actionId: MenuActionId) => {

        switch (actionId) {
            case 'new-game':
                setRulesOpen(false)
                loggerService.info('Nouvelle partie selectionnee')
                navigate('/gameplay')
                break
            case 'map-editor':
                setRulesOpen(false)
                loggerService.info('Editeur de carte selectionne')
                navigate('/map-editor')
                break
            case 'rules':
                setRulesOpen(true)
                break
            case 'options':
                loggerService.info('Options a implementer')
                break
            case 'quit':
                navigate('/')
                break
            default:
        }

  }

  return (
    <>
      <Suspense
        fallback={
          <div className="menu-loading" role="status" aria-live="polite">
            <span className="menu-loading__title">Chargement du menu 3D...</span>
            <span className="menu-loading__text">Preparation de la scene, des effets et des assets.</span>
          </div>
        }
      >
        <MainMenuThree keybinds={keybinds} onAction={handleAction} />
      </Suspense>

      <RulesOverlay open={rulesOpen} keybinds={keybinds} onClose={() => setRulesOpen(false)} />
    </>
  )
}

