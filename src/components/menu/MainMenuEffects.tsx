import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'

export function MainMenuEffects() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.45} intensity={0.8} mipmapBlur />
      <Vignette eskil={false} offset={0.15} darkness={0.6} />
    </EffectComposer>
  )
}

