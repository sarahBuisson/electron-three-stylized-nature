import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { shuffle } from '@services/game/labyrinth/utils.ts';

interface HexagonalParticlesProps {
  width?: number;
  height?: number;
  hexSize?: number;
  particleSize?: number;
  particleColor?: string;
  waveSpeed?: number;
  waveAmplitude?: number;
  waveFrequency?: number;
}

/**
 * Convertit les coordonnées hexagonales en position 2D
 * Utilise le système de coordonnées axial pour les hexagones flat-topped
 */
function hexToPosition(q: number, r: number, size: number): [number, number] {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r)-0.5*size;
  const y = size * (3 / 2) * r-0.5*size;
  return [x, y];
}

/**
 * Composant de particules disposées en grille hexagonale avec animation sinusoïdale
 */
export function HexagonalWave({
  width = 10,
  height = 10,
  hexSize = 0.1,
  particleSize = 1,
  particleColor = '#0088ff',
  waveSpeed = 1,
  waveAmplitude = 0.5,
  waveFrequency = 0.5,
}: HexagonalParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Générer les positions et les données pour l'animation
  const { positions, phases } = useMemo(() => {
    const positions: number[] = [];
    const phases: number[] = [];
    const totalParticles = width * height;

    for (let r = 0; r < height; r++) {
      for (let q = 0; q < width; q++) {
        const [x, y] = hexToPosition(q, r, hexSize);
        
        // Position initiale [x, y, z]
        positions.push(x, 0, y);
        
        // Phase pour l'animation sinusoïdale (déphasage basé sur la position)
        const phase = (q / width + r / height) * Math.PI * 2 * waveFrequency;
        phases.push(phase);
      }
    }

    return { positions: new Float32Array(shuffle(positions)), phases };
  }, [width, height, hexSize, waveFrequency]);

  // Animation sinusoïdale
  useFrame((state) => {
    if (!pointsRef.current) return;

    const positionAttribute = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime * waveSpeed;

    for (let i = 0; i < phases.length; i++) {
      const y = Math.sin(time + phases[i]+i) * waveAmplitude-0.5;
      positionAttribute.setY(i, y);
    }

    positionAttribute.needsUpdate = true;
  });

  // Texture pour les sprites (cercle)
/*  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d')!;

    // Dessiner un cercle avec gradient radial
    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;

    return tex;
  }, []);*/
    const texture2=useTexture("./level/japaneese/concentrique.png");
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={particleSize}
        color={particleColor}
        transparent
        opacity={0.95}
        sizeAttenuation
        map={texture2}
        alphaTest={0.01}
        depthWrite={false}
      />
    </points>
  );
}

