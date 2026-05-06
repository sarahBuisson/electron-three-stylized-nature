export type MenuActionId = 'new-game' | 'rules' | 'options' | 'quit'

export interface MenuItem {
  id: MenuActionId
  label: string
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'new-game', label: 'Nouvelle Partie' },
  { id: 'rules', label: 'Regles' },
  { id: 'options', label: 'Options' },
  { id: 'quit', label: 'Quitter' },
]

