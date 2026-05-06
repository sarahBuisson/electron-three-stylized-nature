import type { Keybinds } from '@models/Keybinds'
import { DEFAULT_KEYBINDS } from '@models/Keybinds'
import type { SaveSlot } from '@models/SaveSlot'
import { DEFAULT_SAVE_SLOTS } from '@models/SaveSlot'
import type { Settings } from '@models/Settings'
import { DEFAULT_SETTINGS } from '@models/Settings'
import type { StoragePort } from './StoragePort'

// Stub adapter for the desktop runtime. Wire IPC later in preload/main.
export class ElectronFileAdapter implements StoragePort {
  getSettings(): Settings {
    return DEFAULT_SETTINGS
  }

  setSettings(_settings: Settings): void {}

  getKeybinds(): Keybinds {
    return DEFAULT_KEYBINDS
  }

  setKeybinds(_keybinds: Keybinds): void {}

  getSaveSlots(): SaveSlot[] {
    return DEFAULT_SAVE_SLOTS
  }

  setSaveSlots(_slots: SaveSlot[]): void {}
}
