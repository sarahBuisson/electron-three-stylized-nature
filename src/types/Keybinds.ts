export interface Keybinds {
  menuUp: string
  menuDown: string
  confirm: string
  close: string
  // FPS Controls
  moveForward: string
  moveBackward: string
  moveLeft: string
  moveRight: string
  jump: string
  // Gameplay Actions
  toggleCameraMode: string
  takeSnapshot: string
}

export const DEFAULT_KEYBINDS: Keybinds = {
  menuUp: 'ArrowUp',
  menuDown: 'ArrowDown',
  confirm: 'Enter',
  close: 'Escape',
  // FPS Controls
  moveForward: 'w',
  moveBackward: 's',
  moveLeft: 'a',
  moveRight: 'd',
  jump: ' ',
  // Gameplay Actions
  toggleCameraMode: 'm',
  takeSnapshot: 'p',
}

