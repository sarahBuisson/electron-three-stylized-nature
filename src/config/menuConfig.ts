export type MenuActionId = 'new-game' | 'map-editor' | 'rules' | 'options' | 'quit'

export interface MenuItem {
  id: MenuActionId
  label: string
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'new-game', label: 'New Game' },
  { id: 'map-editor', label: 'Editor' },

  { id: 'quit', label: 'Exit' },
]

