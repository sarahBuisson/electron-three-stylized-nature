

export interface PhysicsWorldConfig {
  gravity: { x: number; y: number; z: number }
}

export class PhysicsService {
  static createWorldConfig(gravityY: number = -9.81): PhysicsWorldConfig {
    return {
      gravity: { x: 0, y: gravityY, z: 0 },
    }
  }

  static createCubeColliderShape(size: number) {
    return {
      type: 'cuboid',
      args: [size / 2, size / 2, size / 2],
    }
  }

  static createGroundColliderShape(width: number, height: number, depth: number) {
    return {
      type: 'cuboid',
      args: [width / 2, height / 2, depth / 2],
    }
  }
}

export const physicsService = PhysicsService

