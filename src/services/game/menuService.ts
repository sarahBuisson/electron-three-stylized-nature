import type { MenuActionId } from '@config/menuConfig'

export interface MenuActionHandlers {
  onNewGame: () => void
  onRules: () => void
  onOptions: () => void
  onQuit: () => void
}

export function runMenuAction(actionId: MenuActionId, handlers: MenuActionHandlers): void {
  if (actionId === 'new-game') {
    handlers.onNewGame()
    return
  }

  if (actionId === 'rules') {
    handlers.onRules()
    return
  }

  if (actionId === 'options') {
    handlers.onOptions()
    return
  }

  handlers.onQuit()
}

