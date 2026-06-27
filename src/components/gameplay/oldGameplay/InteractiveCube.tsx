import { useRef, useState, useMemo } from 'react'
import { Mesh, ShaderMaterial, Texture } from 'three'
import { useFrame } from '@react-three/fiber'
import { RigidBody } from '@react-three/rapier'
import { Select } from '@react-three/postprocessing';

export interface InteractiveCubeProps {
  position: [number, number, number]
  scale: number
  hoverMessage: string
  clickMessage: string
  onHover?: (message: string) => void
  onUnhover?: () => void
  onClick?: (message: string) => void
  autoLookTarget: [number, number, number]
  material: ShaderMaterial
  texture?: Texture
}

export function InteractiveCube({
  position,
  scale,
  hoverMessage,
  clickMessage,
  onHover,
  onUnhover,
  onClick,
  autoLookTarget,
  material,
}: InteractiveCubeProps) {
  const meshRef = useRef<Mesh>(null)
  const [isHovered, setIsHovered] = useState(false)
  const materialRef = useRef<ShaderMaterial>(material)

  // Outline effect via emissive on hover
  const handlePointerEnter = () => {
    setIsHovered(true)
    onHover?.(hoverMessage)
  }

  const handlePointerLeave = () => {
    setIsHovered(false)
    onUnhover?.()
  }

  const handleClick = () => {
    onClick?.(clickMessage)
  }

  useFrame(({ camera }) => {
    if (meshRef.current && materialRef.current) {
      // Update shader camera position uniform
      const shader = materialRef.current as ShaderMaterial
      if (shader.uniforms && shader.uniforms.cameraPosition) {
        shader.uniforms.cameraPosition.value = camera.position
      }
    }
  })

  // Clone material for this cube instance
  const instanceMaterial = useMemo(() => {
    const cloned = materialRef.current.clone() as ShaderMaterial
    return cloned
  }, [])

  return (
    <RigidBody type="dynamic" position={position} colliders="cuboid">
      <Select enabled={isHovered}>
        <mesh
          ref={meshRef}
          scale={scale}
          material={instanceMaterial}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onClick={handleClick}
        >
          <boxGeometry args={[1, 1, 1]} />
        </mesh>
      </Select>
    </RigidBody>
  )
}

