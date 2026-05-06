import type { Keybinds } from '@models/Keybinds'

export function isConfirmKey(key: string, keybinds: Keybinds): boolean {
  return key === keybinds.confirm || key === ' '
}

export function isMenuUpKey(key: string, keybinds: Keybinds): boolean {
  return key === keybinds.menuUp || key.toLowerCase() === 'w'
}

export function isMenuDownKey(key: string, keybinds: Keybinds): boolean {
  return key === keybinds.menuDown || key.toLowerCase() === 's'
}

export function isCloseKey(key: string, keybinds: Keybinds): boolean {
  return key === keybinds.close
}


