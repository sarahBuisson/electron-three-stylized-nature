import type { Keybinds } from '@models/Keybinds'

export const KEYBIND_PRESETS = {
  WASD: {
    menuUp: 'ArrowUp',
    menuDown: 'ArrowDown',
    confirm: 'Enter',
    close: 'Escape',
    moveForward: 'w',
    moveBackward: 's',
    moveLeft: 'a',
    moveRight: 'd',
    jump: ' ',
    toggleCameraMode: 'm',
    takeSnapshot: 'p',
  } as Keybinds,
  AZERTY: {
    menuUp: 'ArrowUp',
    menuDown: 'ArrowDown',
    confirm: 'Enter',
    close: 'Escape',
    moveForward: 'z',
    moveBackward: 's',
    moveLeft: 'q',
    moveRight: 'd',
    jump: ' ',
    toggleCameraMode: 'm',
    takeSnapshot: 'p',
  } as Keybinds,
}

export type KeybindPresetType = keyof typeof KEYBIND_PRESETS
