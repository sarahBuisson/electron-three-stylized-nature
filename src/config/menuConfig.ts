export type MenuActionId = 'new-game' | 'map-editor' | 'rules' | 'options' | 'quit'

export interface MenuItem {
  id: MenuActionId
  label: string
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'new-game', label: 'Nouvelle Partie' },
  { id: 'map-editor', label: 'Editeur de Carte' },
  { id: 'rules', label: 'Regles' },
  { id: 'options', label: 'Options' },
  { id: 'quit', label: 'Quitter' },
]

