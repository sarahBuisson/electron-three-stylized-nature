import type { GameFlowState } from '@models/GameFlowState'
export const ROUTES = {
  title:    '/',
  menu:     '/menu',
  gameplay: '/gameplay',
  rules:    '/rules',
  options:  '/options',
} as const

export const flowService = {
  goToMenu(): GameFlowState {
    return 'menu'
  },
  goToTitle(): GameFlowState {
    return 'title'
  },
  goToGameplay(): GameFlowState {
    return 'gameplay'
  },
}


