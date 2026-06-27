import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';
import { HexagonalParticles } from './HexagonalParticles';

/**
 * Exemple d'utilisation du composant HexagonalParticles
 * Peut être utilisé comme point de départ pour vos propres scènes
 */
export function HexagonalParticlesExample() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1e' }}>
      <Canvas
        camera={{
          position: [0, 15, 15],
          fov: 60,
        }}
      >
        {/* Background */}
        <color attach="background" args={['#0f0f1e']} />

        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Particules hexagonales avec animation d'onde */}
        <HexagonalParticles
          width={15}
          height={15}
          hexSize={1}
          particleSize={0.3}
          particleColor="#00ff88"
          waveSpeed={1}
          waveAmplitude={0.5}
          waveFrequency={0.5}
        />

        {/* Helpers */}
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={5}
          maxDistance={50}
        />
        <gridHelper args={[50, 50, '#333344', '#1a1a2e']} />
        <Stats />
      </Canvas>
    </div>
  );
}

/**
 * Exemple avec plusieurs couches de particules
 */
export function HexagonalParticlesLayeredExample() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a1e' }}>
      <Canvas camera={{ position: [0, 20, 20], fov: 60 }}>
        <color attach="background" args={['#0f0f1e']} />
        <ambientLight intensity={0.4} />

        {/* Couche 1 : Cyan, lent */}
        <HexagonalParticles
          width={12}
          height={12}
          hexSize={1.2}
          particleSize={0.25}
          particleColor="#00ffff"
          waveSpeed={0.8}
          waveAmplitude={0.6}
          waveFrequency={0.4}
        />

        {/* Couche 2 : Magenta, rapide, décalé */}
        <group position={[0, 0.5, 0]}>
          <HexagonalParticles
            width={12}
            height={12}
            hexSize={0.6}
            particleSize={0.15}
            particleColor="#ff00ff"
            waveSpeed={1.5}
            waveAmplitude={0.4}
            waveFrequency={0.8}
          />
        </group>

        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
}

/**
 * Exemple avec effet de champ d'énergie
 */
export function HexagonalParticlesEnergyFieldExample() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 10, 25], fov: 75 }}>
        <color attach="background" args={['#000000']} />

        {/* Lighting dramatique */}
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 5, 0]} intensity={2} color="#00ffff" />
        <pointLight position={[0, -5, 0]} intensity={1} color="#ff00ff" />

        {/* Field principal */}
        <HexagonalParticles
          width={20}
          height={20}
          hexSize={0.8}
          particleSize={0.2}
          particleColor="#00ffff"
          waveSpeed={2}
          waveAmplitude={1.2}
          waveFrequency={1}
        />

        {/* Particules de fond */}
        <group position={[0, -2, 0]}>
          <HexagonalParticles
            width={25}
            height={25}
            hexSize={0.5}
            particleSize={0.1}
            particleColor="#ffffff"
            waveSpeed={0.5}
            waveAmplitude={0.3}
            waveFrequency={0.3}
          />
        </group>

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enableDamping
        />
        <fog attach="fog" args={['#000000', 20, 50]} />
      </Canvas>
    </div>
  );
}

/**
 * Exemple compact pour intégration dans une page existante
 */
export function HexagonalParticlesCompact() {
  return (
    <Canvas camera={{ position: [0, 8, 8] }}>
      <ambientLight intensity={0.5} />
      <HexagonalParticles
        width={8}
        height={8}
        hexSize={1}
        particleColor="#4a90e2"
      />
      <OrbitControls />
    </Canvas>
  );
}

