import { Environment, Float, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { MENU_ITEMS, type MenuActionId } from '@config/menuConfig'
import { GAMEPLAY_MENU_PRESET } from '@config/visualPresets'
import { isConfirmKey, isMenuDownKey, isMenuUpKey } from '@services/game/inputService'
import type { Keybinds } from '@models/Keybinds'
import { useEffect, useMemo, useState } from 'react'
import { MenuButton3D } from './MenuButton3D'


interface MainMenu3DProps {
  keybinds: Keybinds
  onAction: (id: MenuActionId) => void
}

export function MainMenu3D({ keybinds, onAction }: MainMenu3DProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  const itemPositions = useMemo<[number, number, number][]>(
    () => MENU_ITEMS.map((_, index) => [0, 1.2 - index * 1.05, 0]),
    [],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isMenuUpKey(event.key, keybinds)) {
        setActiveIndex((prev) => (prev === 0 ? MENU_ITEMS.length - 1 : prev - 1))
        return
      }

      if (isMenuDownKey(event.key, keybinds)) {
        setActiveIndex((prev) => (prev + 1) % MENU_ITEMS.length)
        return
      }

      if (isConfirmKey(event.key, keybinds)) {
        onAction(MENU_ITEMS[activeIndex].id)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeIndex, keybinds, onAction])

  return (
    <div className="menu-canvas-wrap">
      <Canvas
        shadows
        camera={{ position: GAMEPLAY_MENU_PRESET.camera, fov: 45 }}
        gl={{ antialias: true }}
        onPointerMissed={() => undefined}
      >
        <color attach="background" args={[GAMEPLAY_MENU_PRESET.fogColor]} />
        <fog
          attach="fog"
          args={[
            GAMEPLAY_MENU_PRESET.fogColor,
            GAMEPLAY_MENU_PRESET.fogNear,
            GAMEPLAY_MENU_PRESET.fogFar,
          ]}
        />

        <ambientLight intensity={GAMEPLAY_MENU_PRESET.ambientLight} />
        <directionalLight
          castShadow
          position={[4, 8, 5]}
          intensity={GAMEPLAY_MENU_PRESET.directionalLight}
        />

        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#10182c" />
        </mesh>

        <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.2}>
          {MENU_ITEMS.map((item, index) => (
            <MenuButton3D
              key={item.id}
              label={item.label}
              position={itemPositions[index]}
              active={index === activeIndex}
              onHover={() => setActiveIndex(index)}
              onClick={() => onAction(item.id)}
            />
          ))}
        </Float>

        <Environment preset="city" />


        <OrbitControls enablePan={false} enableRotate={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}


