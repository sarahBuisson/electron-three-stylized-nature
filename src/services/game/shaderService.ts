import { ShaderMaterial, Texture } from 'three'
import { combinedFragmentShader, combinedVertexShader } from '@shaders/combinedMaterial/combinedMaterial.ts';

export interface CombinedMaterialUniforms {
  uTexture: { value: Texture }
  uLightDirection: { value: { x: number; y: number; z: number } }
  uDistanceMin: { value: number }
  uDistanceMax: { value: number }
  uToonLevels: { value: number }
  uDistanceGradientMix: { value: number }
  uTextureMix: { value: number }
  cameraPosition: { value: { x: number; y: number; z: number } }
}

export function createCombinedMaterial(texture: Texture): ShaderMaterial {
  const uniforms: Record<string, any> = {
    uTexture: { value: texture },
    uLightDirection: { value: { x: 1, y: 1, z: 1 } },
    uDistanceMin: { value: 0 },
    uDistanceMax: { value: 50 },
    uToonLevels: { value: 3 },
    uDistanceGradientMix: { value: 0.4 },
    uTextureMix: { value: 0.6 },
    cameraPosition: { value: { x: 0, y: 0, z: 0 } },
  }

  return new ShaderMaterial({
    vertexShader: combinedVertexShader,
    fragmentShader: combinedFragmentShader,
    uniforms,
  })
}

