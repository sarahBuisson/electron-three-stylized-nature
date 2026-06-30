import { RigidBody } from '@react-three/rapier'
import React from 'react';
import { useTexture } from '@react-three/drei';
import { Color } from 'three';

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

  const texture = useTexture("./level/drawing/hatch_3.jpg")
  return (
    <RigidBody type="fixed" position={groundY} colliders="cuboid">
      {/* boxGeometry a une épaisseur réelle : plus de collisions fantômes */}
      <mesh receiveShadow>
        <cylinderGeometry args={[size, size,THICKNESS, size]} />
          <meshStandardMaterial fogColor={"white"}></meshStandardMaterial>


          <superflatBisMaterial uTexture={texture}   fogColor={new Color(0x005aa)}></superflatBisMaterial>
      </mesh>
    </RigidBody>
  )
}

