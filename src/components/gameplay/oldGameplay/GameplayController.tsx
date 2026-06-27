import { useState, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera as PerspectiveCameraThree, Vector3, Euler } from 'three'
import type { Keybinds } from '@models/Keybinds'
import { isToggleCameraModeKey, isTakeSnapshotKey } from '@services/game/inputService'
import { cameraService, type CameraMode } from '@services/game/cameraService'
import { usePlayerRigidBody } from './playerContext'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
export const MOVEMENT_SPEED = 20
export const CAMERA_AUTO_SPEED = 2
export const MOUSE_SENSITIVITY = 0.003
export const JUMP_IMPULSE = 8
export const GROUNDED_VEL_THRESHOLD = 0.2

// ---------------------------------------------------------------------------
// GameplayController
// ---------------------------------------------------------------------------
interface GameplayControllerProps {
  keybinds: Keybinds
  onSnapshotTaken: (dataUrl: string) => void
}

export function GameplayController({ keybinds, onSnapshotTaken }: GameplayControllerProps) {
  const { camera, gl, scene } = useThree()
  const playerContext = usePlayerRigidBody()
  const [cameraMode, setCameraMode] = useState<CameraMode>('manual')
  const autoLookTarget = useRef<Vector3 | null>(null)
  const keysPressed = useRef<Record<string, boolean>>({})
  const isGrounded = useRef(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = true

      if (isToggleCameraModeKey(e.key, keybinds)) {
        setCameraMode((prev) => cameraService.toggleMode(prev))
      }

      if (isTakeSnapshotKey(e.key, keybinds)) {
        gl.render(scene, camera as PerspectiveCameraThree)
        onSnapshotTaken(gl.domElement.toDataURL('image/png'))
      }

      // Saut : espace + joueur au sol
      if (e.key === keybinds.jump && isGrounded.current) {
        const rb = playerContext?.playerRigidBody
        if (rb) {
          rb.applyImpulse({ x: 0, y: JUMP_IMPULSE, z: 0 }, true)
          isGrounded.current = false
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false
    }

    const handlePointerLock = () => {
      if (cameraMode === 'manual') {
        const el = gl.domElement as HTMLElement & { mozRequestPointerLock?: () => void }
        ;(el.requestPointerLock ?? el.mozRequestPointerLock)?.call(el)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (cameraMode === 'manual' && document.pointerLockElement === gl.domElement) {
        const euler = new Euler(0, 0, 0, 'YXZ')
        euler.setFromQuaternion(camera.quaternion)
        euler.y -= e.movementX * MOUSE_SENSITIVITY
        euler.x -= e.movementY * MOUSE_SENSITIVITY
        euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x))
        camera.quaternion.setFromEuler(euler)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    gl.domElement.addEventListener('click', handlePointerLock)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      gl.domElement.removeEventListener('click', handlePointerLock)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [keybinds, cameraMode, gl, camera, scene, onSnapshotTaken, playerContext])

  useFrame((_state, delta) => {
    if (!playerContext?.playerRigidBody) return

    const rb = playerContext.playerRigidBody
    const currentVel = rb.linvel()

    isGrounded.current = Math.abs(currentVel.y) < GROUNDED_VEL_THRESHOLD

    const movement = new Vector3()

    if (keysPressed.current[keybinds.moveForward.toLowerCase()])
      movement.add(camera.getWorldDirection(new Vector3()))
    if (keysPressed.current[keybinds.moveBackward.toLowerCase()])
      movement.add(camera.getWorldDirection(new Vector3()).multiplyScalar(-1))
    if (keysPressed.current[keybinds.moveLeft.toLowerCase()]) {
      const right = new Vector3()
      camera.getWorldDirection(right).cross(camera.up)
      movement.add(right.multiplyScalar(-1))
    }
    if (keysPressed.current[keybinds.moveRight.toLowerCase()]) {
      const right = new Vector3()
      camera.getWorldDirection(right).cross(camera.up)
      movement.add(right)
    }

    movement.normalize().multiplyScalar(MOVEMENT_SPEED)
    rb.setLinvel({ x: movement.x, y: currentVel.y, z: movement.z }, true)

    if (cameraMode === 'auto' && autoLookTarget.current) {
      const direction = autoLookTarget.current.clone().sub(camera.position).normalize()
      const targetQ = camera.quaternion.clone()
      targetQ.setFromUnitVectors(new Vector3(0, 0, -1), direction)
      camera.quaternion.slerp(targetQ, CAMERA_AUTO_SPEED * delta)
    }
  })

  return <></>
}

