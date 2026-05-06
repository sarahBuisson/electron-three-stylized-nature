export interface SaveSlot {
  id: number
  name: string
  updatedAt: string
  progressPercent: number
}

export const DEFAULT_SAVE_SLOTS: SaveSlot[] = [
  { id: 1, name: 'Slot 1', updatedAt: '', progressPercent: 0 },
  { id: 2, name: 'Slot 2', updatedAt: '', progressPercent: 0 },
  { id: 3, name: 'Slot 3', updatedAt: '', progressPercent: 0 },
]

