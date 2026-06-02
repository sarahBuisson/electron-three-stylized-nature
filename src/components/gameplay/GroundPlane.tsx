import { RigidBody } from '@react-three/rapier'

// GROUND_THICKNESS : demi-épaisseur du sol visible, le dessus est exactement à y=0
const THICKNESS = 0.5

export interface GroundPlaneProps {
  position: [number, number, number]
  size: number
}

export function GroundPlane({ position, size }: GroundPlaneProps) {
  // Le RigidBody est centré sur position ; le mesh est à [0,0,0] relatif
  // On décale le centre vers le bas de THICKNESS/2 pour que la surface soit à y=position.y
  const groundY: [number, number, number] = [position[0], position[1] - THICKNESS / 2, position[2]]

  return (
    <RigidBody type="fixed" position={groundY} colliders="cuboid">
      {/* boxGeometry a une épaisseur réelle : plus de collisions fantômes */}
      <mesh receiveShadow>
        <boxGeometry args={[size, THICKNESS, size]} />
        <meshStandardMaterial color="#f5d800" />
      </mesh>
    </RigidBody>
  )
}

