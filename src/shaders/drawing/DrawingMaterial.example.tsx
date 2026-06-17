import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { DrawingMaterial } from './DrawingMaterial';
import * as THREE from 'three';
/**
 * Example component demonstrating the DrawingMaterial usage
 *
 * This cross-hatching shader creates a stylized pen-and-ink look with:
 * - Blinn-Phong shading
 * - Rim lighting
 * - Multiple hatching layers based on light intensity
 * - Paper texture overlay
 */
export const DrawingMaterialExample = () => {
  // Load textures (you would need to provide these hatching textures)
   const hatchTextures = [
     new THREE.TextureLoader().load('./level/drawing/hatch_0.jpg'),
     new THREE.TextureLoader().load('./level/drawing/hatch_1.jpg'),
     new THREE.TextureLoader().load('./level/drawing/hatch_2.jpg'),
     new THREE.TextureLoader().load('./level/drawing/hatch_3.jpg'),
     new THREE.TextureLoader().load('./level/drawing/hatch_4.jpg'),
     new THREE.TextureLoader().load('./level/drawing/hatch_5.jpg'),
   ];
  // const paperTexture = new THREE.TextureLoader().load('./level/drawing/paper.jpg');

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <OrbitControls />

        {/* Example: TorusKnot with DrawingMaterial */}
        <mesh material>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <DrawingMaterial
            ambientWeight={0.08}
            diffuseWeight={1.0}
            rimWeight={0.46}
            specularWeight={1.0}
            shininess={49}
            invertRim={false}
            displayOutline={false}
            solidRender={false}
            inkColor={[72, 72, 164]}
            lightPosition={[-100, 100, 0]}
            repeat={[4, 2]}
             hatchTextures={hatchTextures}
            // paperTexture={paperTexture}
          />
        </mesh>

        {/* Example: Sphere with different settings */}
        <mesh position={[3, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <DrawingMaterial
            ambientWeight={0.13}
            diffuseWeight={0.27}
            rimWeight={0.76}
            specularWeight={1.0}
            shininess={27}
            invertRim={false}
            displayOutline={true}
            solidRender={false}
            inkColor={[41, 41, 202]}
            repeat={[2, 2]}
          />
        </mesh>

        {/* Example: Box with sketch preset */}
        <mesh position={[-3, 0, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <DrawingMaterial
            ambientWeight={0.098}
            diffuseWeight={1.0}
            rimWeight={0.81}
            specularWeight={1.0}
            shininess={12}
            invertRim={true}
            displayOutline={false}
            solidRender={false}
            inkColor={[175, 175, 175]}
            repeat={[1, 1]}
          />
        </mesh>
      </Canvas>
    </div>
  );
};



