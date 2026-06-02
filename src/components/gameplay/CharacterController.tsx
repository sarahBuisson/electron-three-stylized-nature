import { useRef, useCallback, type RefObject } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier'
import { usePlayerRigidBody } from './playerContext.tsx'

// Dimensions de la capsule joueur
const PLAYER_RADIUS = 0.3
const PLAYER_HEIGHT = 1.7  // hauteur totale (incluant les demi-sphères)
// Demi-hauteur de la partie cylindrique (sans les caps)
const CAPSULE_HALF = (PLAYER_HEIGHT - 2 * PLAYER_RADIUS) / 2  // 0.55
// Hauteur des yeux = centre capsule + décalage vers le haut
const EYE_OFFSET = CAPSULE_HALF + PLAYER_RADIUS - 0.1  // ~0.75 (proche du sommet)
// Spawn : centre capsule légèrement au-dessus du sol
const SPAWN_Y = CAPSULE_HALF + PLAYER_RADIUS + 0.1  // ~0.95

export function CharacterController() {
  const { camera } = useThree()
  const { setPlayerRigidBody } = usePlayerRigidBody()
  const rigidBodyRef = useRef<RapierRigidBody>(null)

  // Callback ref : enregistre le RigidBody dans le contexte dès sa création par Rapier
  const handleRef = useCallback(
    (rb:  RapierRigidBody | null) => {
      ;(rigidBodyRef as RefObject< RapierRigidBody | null>).current = rb
      if(rb)
      setPlayerRigidBody(rb)
    },
    [setPlayerRigidBody],
  )

  // Chaque frame : synchronise la caméra sur la position physique du joueur
  useFrame(() => {
    if (!rigidBodyRef.current) return
    const { x, y, z } = rigidBodyRef.current.translation()
    camera.position.set(x, y + EYE_OFFSET, z)
  })

  return (
    <RigidBody
      ref={handleRef }
      type="dynamic"
      position={[0, SPAWN_Y, 5]}
      // Empêcher la capsule de se coucher sous l'effet des forces latérales
      enabledRotations={[false, false, false]}
      friction={0.8}
      linearDamping={0.05}
      restitution={0}
    >
      {/* Collider capsule explicite : args=[demi-hauteur cylindrique, rayon] */}
      <CapsuleCollider args={[CAPSULE_HALF, PLAYER_RADIUS]} />
    </RigidBody>
  )
}


