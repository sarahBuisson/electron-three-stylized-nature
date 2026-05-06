import { STORAGE_KEYS } from '@config/storageKeys'
import type { Keybinds } from '@models/Keybinds'
import { DEFAULT_KEYBINDS } from '@models/Keybinds'
import type { SaveSlot } from '@models/SaveSlot'
import { DEFAULT_SAVE_SLOTS } from '@models/SaveSlot'
import type { Settings } from '@models/Settings'
import { DEFAULT_SETTINGS } from '@models/Settings'
import type { StoragePort } from './StoragePort'

function readJson<T>(key: string, fallback: T): T {
  const raw = window.localStorage.getItem(key)
  if (!raw) {
    return fallback
  }

  try {
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export class WebStorageAdapter implements StoragePort {
  getSettings(): Settings {
    return readJson(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  }

  setSettings(settings: Settings): void {
    writeJson(STORAGE_KEYS.settings, settings)
  }

  getKeybinds(): Keybinds {
    return readJson(STORAGE_KEYS.keybinds, DEFAULT_KEYBINDS)
  }

  setKeybinds(keybinds: Keybinds): void {
    writeJson(STORAGE_KEYS.keybinds, keybinds)
  }

  getSaveSlots(): SaveSlot[] {
    return readJson(STORAGE_KEYS.saveSlots, DEFAULT_SAVE_SLOTS)
  }

  setSaveSlots(slots: SaveSlot[]): void {
    writeJson(STORAGE_KEYS.saveSlots, slots)
  }
}
