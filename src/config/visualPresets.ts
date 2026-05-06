export interface MenuVisualPreset {
  camera: [number, number, number]
  ambientLight: number
  directionalLight: number
  fogColor: string
  fogNear: number
  fogFar: number
}

export const GAMEPLAY_MENU_PRESET: MenuVisualPreset = {
  camera: [0, 1.5, 7],
  ambientLight: 0.35,
  directionalLight: 1.2,
  fogColor: '#0b1020',
  fogNear: 8,
  fogFar: 20,
}

