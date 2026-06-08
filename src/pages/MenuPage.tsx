import { lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { runMenuAction } from '@services/game/menuService'
import { storageService } from '@services/storage/storageService'
import type { MenuActionId } from '@config/menuConfig'

const MainMenuThree = lazy(async () => {
  const module = await import('@components/menu/MainMenuThree')
  return { default: module.MainMenuThree }
})

export function MenuPage() {
  const navigate = useNavigate()
  const keybinds = storageService.getKeybinds()

  const handleAction = (actionId: MenuActionId) => runMenuAction(actionId, navigate)

  return (
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
  )
}

