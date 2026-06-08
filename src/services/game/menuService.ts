import type { NavigateFunction } from 'react-router-dom'
import type { MenuActionId } from '@config/menuConfig'
import { ROUTES } from '@services/game/flowService'

export function runMenuAction(actionId: MenuActionId, navigate: NavigateFunction): void {
  switch (actionId) {
    case 'new-game':
      navigate(ROUTES.gameplay)
      break
    case 'rules':
      navigate(ROUTES.rules)
      break
    case 'options':
      navigate(ROUTES.options)
      break
    case 'quit':
      navigate(ROUTES.title)
      break
  }
}

