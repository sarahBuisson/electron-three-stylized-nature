export type GraphicsQuality = 'low' | 'medium' | 'high'

export interface Settings {
  masterVolume: number
  graphicsQuality: GraphicsQuality
}

export const DEFAULT_SETTINGS: Settings = {
  masterVolume: 0.8,
  graphicsQuality: 'high',
}

