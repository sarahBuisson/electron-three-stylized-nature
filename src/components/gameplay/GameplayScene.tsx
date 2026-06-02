import { useState, useMemo, useCallback } from 'react'
import { Canvas } from '@react-three/fiber'
import { CanvasTexture } from 'three'
import { KEYBIND_PRESETS, type KeybindPresetType } from '@config/keybindPresets'
import { createCombinedMaterial } from '@services/game/shaderService'
import { CanvasErrorBoundary } from './CanvasErrorBoundary'
import { GameplaySceneContent } from './GameplaySceneContent'
import { SnapshotGallery } from './SnapshotGallery'
import { PlayerProvider } from './playerContext'
import './GameplayScene.css'

export function GameplayScene() {
  const [snapshots, setSnapshots] = useState<string[]>([])
  const [hoverMessage, setHoverMessage] = useState('')
  const [clickMessage, setClickMessage] = useState('')
  const [canvasInstance, setCanvasInstance] = useState(0)
  const [keybindPreset, setKeybindPreset] = useState<KeybindPresetType>('WASD')

  const activeKeybinds = useMemo(() => KEYBIND_PRESETS[keybindPreset], [keybindPreset])

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, 64, 64)
      ctx.fillStyle = '#e0e0e0'
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if ((i + j) % 2 === 0) ctx.fillRect(i * 8, j * 8, 8, 8)
        }
      }
    }
    const t = new CanvasTexture(canvas)
    t.needsUpdate = true
    return t
  }, [])

  const material = useMemo(() => createCombinedMaterial(texture), [texture])

  const handleSnapshotTaken = useCallback((dataUrl: string) => {
    setSnapshots((prev) => [...prev.slice(-9), dataUrl])
  }, [])

  const handleMessageUpdate = useCallback((type: 'hover' | 'click', message: string) => {
    if (type === 'hover') setHoverMessage(message)
    else setClickMessage(message)
  }, [])

  const handleDeleteSnapshot = useCallback((index: number) => {
    setSnapshots((prev) => prev.filter((_, i) => i !== index))
  }, [])

  return (
    <div className="gameplay-scene">
      <div className="gameplay-scene__canvas-container">
        <CanvasErrorBoundary onRetry={() => setCanvasInstance((v) => v + 1)}>
          <Canvas key={canvasInstance} gl={{ antialias: true, preserveDrawingBuffer: true }}>
            <PlayerProvider>
              <GameplaySceneContent
                keybinds={activeKeybinds}
                onSnapshotTaken={handleSnapshotTaken}
                material={material}
                onMessageUpdate={handleMessageUpdate}
              />
            </PlayerProvider>
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      <div className="gameplay-scene__keybind-switcher">
        <label htmlFor="keybind-select" className="gameplay-scene__keybind-label">
          Contrôles :
        </label>
        <select
          id="keybind-select"
          value={keybindPreset}
          onChange={(e) => setKeybindPreset(e.target.value as KeybindPresetType)}
          className="gameplay-scene__keybind-select"
        >
          <option value="WASD">WASD</option>
          <option value="AZERTY">AZERTY (ZQSD)</option>
        </select>
      </div>

      <div className="gameplay-scene__messages">
        {hoverMessage && <div className="gameplay-scene__message-hover">{hoverMessage}</div>}
        {clickMessage && <div className="gameplay-scene__message-click">{clickMessage}</div>}
      </div>

      <SnapshotGallery snapshots={snapshots} onDelete={handleDeleteSnapshot} />
    </div>
  )
}




