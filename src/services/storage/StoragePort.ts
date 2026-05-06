import type { Keybinds } from '@models/Keybinds'
import type { SaveSlot } from '@models/SaveSlot'
import type { Settings } from '@models/Settings'

export interface StoragePort {
  getSettings(): Settings
  setSettings(settings: Settings): void
  getKeybinds(): Keybinds
  setKeybinds(keybinds: Keybinds): void
  getSaveSlots(): SaveSlot[]
  setSaveSlots(slots: SaveSlot[]): void
}
