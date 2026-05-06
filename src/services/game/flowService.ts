import type { GameFlowState } from '@models/GameFlowState'

export const flowService = {
  goToMenu(): GameFlowState {
    return 'menu'
  },
  goToTitle(): GameFlowState {
    return 'title'
  },
}


