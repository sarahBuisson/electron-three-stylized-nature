import { Vector3, Quaternion } from 'three'

export type CameraMode = 'manual' | 'auto'

export interface CameraState {
  mode: CameraMode
  position: Vector3
  target: Vector3
  autoLookTarget?: Vector3
}

export class CameraService {
  static createInitialState(startPosition: Vector3, startTarget: Vector3): CameraState {
    return {
      mode: 'manual',
      position: startPosition.clone(),
      target: startTarget.clone(),
    }
  }

  static toggleMode(currentMode: CameraMode): CameraMode {
    return currentMode === 'manual' ? 'auto' : 'manual'
  }

  static lerpToTarget(
    current: Vector3,
    target: Vector3,
    speed: number,
    deltaTime: number
  ): Vector3 {
    const t = Math.min(speed * deltaTime, 1)
    return current.lerp(target, t)
  }

  static slerpQuaternion(
    current: Quaternion,
    target: Quaternion,
    speed: number,
    deltaTime: number
  ): Quaternion {
    const t = Math.min(speed * deltaTime, 1)
    return current.slerp(target, t)
  }

}

export const cameraService = CameraService

