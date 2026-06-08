export type MenuActionId = 'new-game' | 'rules' | 'options' | 'quit'

export interface MenuItem {
  id: MenuActionId
  label: string
  route?: string
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'new-game', label: 'Nouvelle Partie', route: '/gameplay' },
  { id: 'rules',    label: 'Regles',          route: '/rules'    },
  { id: 'options',  label: 'Options',          route: '/options'  },
  { id: 'quit',     label: 'Quitter'                              },
]

