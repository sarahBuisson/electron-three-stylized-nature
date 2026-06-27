import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { PerspectiveCamera } from '@react-three/drei';
import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';
import { loadMapForPlay, MapToPlay } from '@utils/mapPlayStorage';
import { TableauToThreeContent } from '@components/gameplay/landscape/TableauToThreeContent.tsx';
import { FPSPlayer } from '@components/gameplay/controller/FPSPlayer';
import { storageService } from '@services/storage/storageService';
import './MapPlayPage.css';
import { KEYBIND_PRESETS } from '@config/keybindPresets.ts';
import type { Camera } from '@react-three/fiber/dist/declarations/src/core/utils';
import { GroundPlane } from '@components/gameplay/oldGameplay/GroundPlane.tsx';

export function MapPlayPage() {
    const navigate = useNavigate();
    const [tableau, setTableau] = useState<HexagonalTableau<KaseLandscape> | null>(null);
    const [gameMap, setGameMap] = useState<MapToPlay>(null);
    const [error, setError] = useState<string | null>(null);
    const [solutionUrl, setSolutionUrl] = useState<string | null>(null);
    const cameraSolution = useRef<Camera>()
//    const {camera, gl, scene} = useThree()
    const keybinds = KEYBIND_PRESETS.AZERTY
    console.log(keybinds)

    // Charger la carte au montage
    useEffect(() => {
        const loadedMap = loadMapForPlay();

        if (!loadedMap) {
            setError(previousError => 'No map available to play. Please create a map in the editor first.');
            setTimeout(() => navigate('/map-editor'), 3000);
            return;
        }
        setGameMap(loadedMap);
        setTableau(loadedMap.tableau);
     //   gl.render(scene, cameraSolution.current)
   //     setSolutionUrl(gl.domElement.toDataURL('image/png'))
    }, [navigate]);


    if (error) {
        return (
            <div className="map-play-error">
                <div className="error-content">
                    <h1> No Map Found</h1>
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
            <Canvas gl={{antialias: true}} shadows>
                <KeyboardControls map={keybinds}>
                    <PerspectiveCamera ref={cameraSolution} position={[gameMap.solution.x, 2, gameMap.solution.y]}/>

                    <Physics gravity={[0, -9.81, 0]}>
                        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75}/>

                        <color args={['#87CEEB']} attach="background"/>

                        {/* Lighting */}
                        <ambientLight intensity={0.6}/>
                        <directionalLight
                            position={[10, 10, 5]}
                            intensity={1}
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                        />
                        <hemisphereLight args={['#87CEEB', '#6B8E23', 0.5]}/>
                        <GroundPlane position={[0, 0, 0]} size={tableau.sizeX*4}/>
                        {/* Player */}
                        <FPSPlayer position={[gameMap.start.x, 2, gameMap.start.y]}/>

                        {/* Landscape */}
                        <TableauToThreeContent tableau={tableau}/>

                        {/* Fog for depth */}
                        <fog attach="fog" args={['#87CEEB', 10, 100]}/>
                    </Physics>
                </KeyboardControls>
            </Canvas>
            <img src={solutionUrl} alt="Solution" className="solution-image"/>
        </div>
    );
}

