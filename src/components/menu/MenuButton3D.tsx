import { Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group, Mesh, MeshStandardMaterial } from 'three'
import { Color } from 'three'

interface MenuButton3DProps {
  label: string
  position: [number, number, number]
  active: boolean
  onClick: () => void
  onHover: () => void
}

export function MenuButton3D({ label, position, active, onClick, onHover }: MenuButton3DProps) {
  const groupRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)

  useFrame((_state, delta) => {
    const group = groupRef.current
    const mesh = meshRef.current

    if (!group || !mesh) {
      return
    }

    const targetScale = active ? 1.08 : 1
    const targetY = position[1] + (active ? 0.08 : 0)
    const targetColor = new Color(active ? '#6f6dff' : '#1f2a44')

    group.scale.lerp({ x: targetScale, y: targetScale, z: targetScale } as never, Math.min(1, delta * 8))
    group.position.y += (targetY - group.position.y) * Math.min(1, delta * 10)

    const material = mesh.material as MeshStandardMaterial
    material.color.lerp(targetColor, Math.min(1, delta * 8))
    material.emissive.lerp(new Color(active ? '#4956ff' : '#070b16'), Math.min(1, delta * 8))
  })

  return (
    <group
      ref={groupRef}
      position={position}
      onPointerEnter={onHover}
      onPointerMove={onHover}
      onClick={onClick}
    >
      <mesh ref={meshRef} castShadow receiveShadow>
        <boxGeometry args={[3.8, 0.7, 0.36]} />
        <meshStandardMaterial color="#1f2a44" emissive="#070b16" emissiveIntensity={0.65} />
      </mesh>
      <Text position={[0, 0, 0.22]} fontSize={0.28} color="#ffffff" anchorX="center" anchorY="middle">
        {label}
      </Text>
    </group>
  )
}



