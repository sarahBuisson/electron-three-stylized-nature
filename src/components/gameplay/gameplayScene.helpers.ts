import { CanvasTexture } from 'three'
import type { MessageType } from './types'

const DEFAULT_TEXTURE_SIZE = 64
const DEFAULT_GRID_SIZE = 8

export function createCheckerTexture(size = DEFAULT_TEXTURE_SIZE, gridSize = DEFAULT_GRID_SIZE): CanvasTexture {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')
  if (ctx) {
    const step = size / gridSize
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = '#e0e0e0'
    for (let x = 0; x < gridSize; x += 1) {
      for (let y = 0; y < gridSize; y += 1) {
        if ((x + y) % 2 === 0) {
          ctx.fillRect(x * step, y * step, step, step)
        }
      }
    }
  }

  const texture = new CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

export function addSnapshot(previousSnapshots: string[], snapshot: string, maxSnapshots = 10): string[] {
  const trimmed = previousSnapshots.slice(-(maxSnapshots - 1))
  return [...trimmed, snapshot]
}

export function removeSnapshot(previousSnapshots: string[], indexToRemove: number): string[] {
  return previousSnapshots.filter((_, index) => index !== indexToRemove)
}

export function updateMessages(
  type: MessageType,
  message: string,
  previousHover: string,
  previousClick: string
): { hoverMessage: string; clickMessage: string } {
  if (type === 'hover') {
    return { hoverMessage: message, clickMessage: previousClick }
  }

  return { hoverMessage: previousHover, clickMessage: message }
}

