import { Suspense, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { PerspectiveCamera } from '@react-three/drei';
import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';
import { loadMapForPlay, MapToPlay } from '@utils/mapPlayStorage';
import { TableauToThreeContent } from '@components/gameplay/landscape/TableauToThreeContent.tsx';
import { FPSPlayer } from '@components/gameplay/controller/FPSPlayer';
import { KEYBIND_PRESETS } from '@config/keybindPresets.ts';
import type { Camera } from '@react-three/fiber/dist/declarations/src/core/utils';
import { GroundPlane } from '@components/gameplay/oldGameplay/GroundPlane.tsx';
import { InventoryList } from '@components/gameplay/inventory/InventoryList';
import { createPhotoInventoryItem, readInventory, type InventoryItem, writeInventory } from '@components/gameplay/inventory/inventory.model';
import './MapPlayPage.css';
import { Vector3 } from 'three';

export function MapPlayPage() {
    const navigate = useNavigate();
    const [tableau, setTableau] = useState<HexagonalTableau<KaseLandscape> | null>(null);
    const [gameMap, setGameMap] = useState<MapToPlay | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [solutionUrl, setSolutionUrl] = useState<string | null>(null);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => readInventory('/inventory/camera.png'));
    const cameraSolution = useRef<Camera | null>(null);
    const keybinds = KEYBIND_PRESETS.AZERTY;

    useEffect(() => {
        const loadedMap = loadMapForPlay();

        if (!loadedMap) {
            setError(previousError => previousError ?? 'No map available to play. Please create a map in the editor first.');
            setTimeout(() => navigate('/map-editor'), 3000);
            return;
        }

        setGameMap(loadedMap);
        setTableau(loadedMap.tableau);
        setSolutionUrl('/inventory/camera.png');
    }, [navigate]);

    const handleCameraClick = () => {
        setInventoryItems((previousItems) => {
            const nextItems = [...previousItems];
            const photoCount = previousItems.filter((item) => item.type === 'Photo').length + 1;
            const photoItem = createPhotoInventoryItem(solutionUrl ?? '/inventory/camera.png', photoCount);
            nextItems.push(photoItem);
            writeInventory(nextItems);
            return nextItems;
        });
    };

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

    if (!tableau || !gameMap) {
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

            <Canvas gl={{ antialias: true }} shadows>
                <KeyboardControls map={keybinds}>
                    <PerspectiveCamera ref={cameraSolution} position={[gameMap.solution.x, 2, gameMap.solution.y]} />

                    <Physics gravity={[0, -9.81, 0]}>
                        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />

                        <color args={['#87CEEB']} attach="background" />

                        <ambientLight intensity={0.6} />
                        <directionalLight
                            position={[10, 10, 5]}
                            intensity={1}
                            castShadow
                            shadow-mapSize-width={2048}
                            shadow-mapSize-height={2048}
                        />
                        <hemisphereLight args={['#87CEEB', '#6B8E23', 0.5]} />
                        <GroundPlane position={[0, 0, 0]} size={tableau.sizeX * 4} />
                        <FPSPlayer position={new Vector3(gameMap.start.x, 2, gameMap.start.y)} />

                        <TableauToThreeContent mapToPlay={gameMap} />

                        <fog attach="fog" args={['#87CEEB', 10, 100]} />
                    </Physics>
                </KeyboardControls>
            </Canvas>

            {solutionUrl ? <img src={solutionUrl} alt="Solution" className="solution-image" /> : null}
            <InventoryList items={inventoryItems} onCameraClick={handleCameraClick} />
        </div>
    );
}
