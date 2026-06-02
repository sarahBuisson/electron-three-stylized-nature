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

// FPS Input helpers
export function isMoveForwardKey(key: string, keybinds: Keybinds): boolean {
  return key.toLowerCase() === keybinds.moveForward.toLowerCase()
}

export function isMoveBackwardKey(key: string, keybinds: Keybinds): boolean {
  return key.toLowerCase() === keybinds.moveBackward.toLowerCase()
}

export function isMoveLeftKey(key: string, keybinds: Keybinds): boolean {
  return key.toLowerCase() === keybinds.moveLeft.toLowerCase()
}

export function isMoveRightKey(key: string, keybinds: Keybinds): boolean {
  return key.toLowerCase() === keybinds.moveRight.toLowerCase()
}

export function isJumpKey(key: string, keybinds: Keybinds): boolean {
  return key === keybinds.jump
}

export function isToggleCameraModeKey(key: string, keybinds: Keybinds): boolean {
  return key.toLowerCase() === keybinds.toggleCameraMode.toLowerCase()
}

export function isTakeSnapshotKey(key: string, keybinds: Keybinds): boolean {
  return key.toLowerCase() === keybinds.takeSnapshot.toLowerCase()
}


