import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { PerspectiveCamera } from '@react-three/drei';
import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';
import { loadMapForPlay } from '@utils/mapPlayStorage';
import { LandscapeContent } from '@components/gameplay/landscape/LandscapeContent';
import { FPSPlayer } from '@components/gameplay/controller/FPSPlayer';
import { storageService } from '@services/storage/storageService';
import './MapPlayPage.css';

export function MapPlayPage() {
  const navigate = useNavigate();
  const [tableau, setTableau] = useState<HexagonalTableau<KaseLandscape> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Charger la carte au montage
  useEffect(() => {
    const loadedMap = loadMapForPlay();
    
    if (!loadedMap) {
      setError('No map available to play. Please create a map in the editor first.');
      setTimeout(() => navigate('/map-editor'), 3000);
      return;
    }

    setTableau(loadedMap);
  }, [navigate]);

  const keybinds = storageService.getKeybinds();

  if (error) {
    return (
      <div className="map-play-error">
        <div className="error-content">
          <h1>❌ No Map Found</h1>
          <p>{error}</p>
          <button onClick={() => navigate('/map-editor')}>
            Return to Editor
          </button>
        </div>
      </div>
    );
  }

  if (!tableau) {
    return (
      <div className="map-play-loading">
        <div className="loading-content">
          <h1>Loading Map...</h1>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="map-play-page">
      {/* UI Overlay */}
      <div className="map-play-overlay">
        <div className="overlay-top">
          <button className="back-button" onClick={() => navigate('/map-editor')}>
            ← Back to Editor
          </button>
          <div className="map-info">
            <span>Map Size: {tableau.sizeX}×{tableau.sizeY}</span>
            <span>•</span>
            <span>Controls: WASD + Mouse</span>
            <span>•</span>
            <span>Space: Jump</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas gl={{ antialias: true }} shadows>
        <KeyboardControls map={keybinds}>
          <Physics gravity={[0, -9.81, 0]}>
            <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />
            
            <color args={['#87CEEB']} attach="background" />
            
            {/* Lighting */}
            <ambientLight intensity={0.6} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={1}
              castShadow
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
            <hemisphereLight args={['#87CEEB', '#6B8E23', 0.5]} />

            {/* Player */}
            <FPSPlayer position={[0, 2, 0]} />

            {/* Landscape */}
            <LandscapeContent tableau={tableau} />

            {/* Fog for depth */}
            <fog attach="fog" args={['#87CEEB', 10, 100]} />
          </Physics>
        </KeyboardControls>
      </Canvas>
    </div>
  );
}

