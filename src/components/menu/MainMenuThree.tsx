import { OrbitControls, Text } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { MENU_ITEMS, type MenuActionId } from '@config/menuConfig'
import type { Keybinds } from '@models/Keybinds'
import { Suspense, useMemo, useState } from 'react'
interface MainMenuThreeProps {
  keybinds: Keybinds
  onAction: (id: MenuActionId) => void
}

interface ThreeMenuButtonProps {
  label: string
  position: [number, number, number]
  active: boolean
  onHover: () => void
  onClick: () => void
}

function ThreeMenuButton({ label, position, active, onHover, onClick }: ThreeMenuButtonProps) {
  return (
    <group position={position} onPointerEnter={onHover} onPointerMove={onHover} onClick={onClick}>
      <mesh>
        <boxGeometry args={[3.2, 0.65, 0.2]} />
        <meshStandardMaterial color={active ? '#4f63ff' : '#1a2338'} emissive={active ? '#283cff' : '#0a1221'} />
      </mesh>
      <Suspense>
        <Text
            position={[0, 0, 0.12]}
            fontSize={0.26}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font={'./font/Roboto_Condensed-Black.ttf'}
        >
            {label}
        </Text >
      </Suspense>
    </group>
  )
}

export function MainMenuThree({ keybinds, onAction }: MainMenuThreeProps) {
  void keybinds
  const [activeIndex, setActiveIndex] = useState(0)

  const positions = useMemo<[number, number, number][]>(
    () => MENU_ITEMS.map((_, index) => [0, 1.2 - index * 0.95, 0]),
    [],
  )

  return (
    <div className="menu-canvas-wrap">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true }}>

        {MENU_ITEMS.map((item, index) => (
          <ThreeMenuButton
            key={item.id}
            label={`${item.label} three`}
            position={positions[index]}
            active={activeIndex === index}
            onHover={() => setActiveIndex(index)}
            onClick={() => onAction(item.id)}
          />
        ))}


        <OrbitControls />
      </Canvas>
    </div>
  )
}
