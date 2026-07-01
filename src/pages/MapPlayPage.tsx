import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useThree } from '@react-three/fiber';
import { Cloud, KeyboardControls, useTexture } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { PerspectiveCamera } from '@react-three/drei';
import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';
import { loadMapForPlay, MapToPlay } from '@utils/mapPlayStorage';
import { TableauToThreeContent } from '@components/gameplay/landscape/TableauToThreeContent.tsx';
import { FPSPlayer } from '@components/gameplay/controller/FPSPlayer';
import { KEYBIND_PRESETS } from '@config/keybindPresets.ts';
import { GroundPlane } from '@components/gameplay/oldGameplay/GroundPlane.tsx';
import { InventoryList } from '@components/gameplay/inventory/InventoryList';
import { createPhotoInventoryItem, readInventory, type InventoryItem, writeInventory } from '@components/gameplay/inventory/inventory.model';
import './MapPlayPage.css';
import { Vector3, type PerspectiveCamera as PerspectiveCameraType } from 'three';
import {Blob}from '@components/gameplay/common/blob/Blob'
// eslint-disable-next-line no-unused-vars
type CaptureHandler = (handler: () => Promise<string>) => void;

function SceneCaptureBridge({ onCaptureReady }: { onCaptureReady: CaptureHandler }) {
    const { gl, scene, camera } = useThree();

    const captureView = useCallback(async () => {
        gl.render(scene, camera);

        return new Promise<string>((resolve, reject) => {
            gl.domElement.toBlob((blob) => {
                if (!blob) {
                    reject(new Error('Unable to capture the current camera view.'));
                    return;
                }

                resolve(URL.createObjectURL(blob));
            }, 'image/png');
        });
    }, [camera, gl, scene]);

    useEffect(() => {
        onCaptureReady(captureView);
    }, [captureView, onCaptureReady]);

    return null;
}

function SceneReady(props: { callback: () => Promise<void> }) {
    useEffect(() => {
        console.log('ready');
    }, []);

}

export function MapPlayPage() {
    const navigate = useNavigate();
    const initialMap = useMemo(() => loadMapForPlay(), []);
    const [tableau] = useState<HexagonalTableau<KaseLandscape> | null>(() => initialMap?.tableau ?? null);
    const [gameMap] = useState<MapToPlay | null>(() => initialMap ?? null);
    const [error] = useState<string | null>(() => initialMap ? null : 'No map available to play. Please create a map in the editor first.');
    const [solutionUrl] = useState<string | null>('/inventory/camera.png');
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => readInventory('/inventory/camera.png'));
    const [playerPosition, setPlayerPosition] = useState<Vector3 | null>(() => initialMap ? new Vector3(initialMap.start.x, 2, initialMap.start.y) : null);
    const cameraSolution = useRef<PerspectiveCameraType | null>(null);
    const captureViewRef = useRef<(() => Promise<string>) | null>(null);
    const keybinds = KEYBIND_PRESETS.AZERTY;

    const registerCaptureView = useCallback((capture: () => Promise<string>) => {
        captureViewRef.current = capture;
    }, []);

    useEffect(() => {
        writeInventory(inventoryItems);
    }, [inventoryItems]);

    useEffect(() => {
        if (!initialMap) {
            const timeoutId = window.setTimeout(() => {
                navigate('/map-editor');
            }, 3000);

            return () => {
                window.clearTimeout(timeoutId);
            };
        }
    }, [initialMap, navigate]);

    const handleCameraClick = async () => {
        const photoUrl = captureViewRef.current
            ? await captureViewRef.current().catch(() => solutionUrl ?? '/inventory/camera.png')
            : (solutionUrl ?? '/inventory/camera.png');

        setInventoryItems((previousItems) => {
            const nextItems = [...previousItems];
            const photoCount = previousItems.filter((item) => item.type === 'Photo').length + 1;
            const photoItem = createPhotoInventoryItem(photoUrl, photoCount);
            nextItems.push(photoItem);
            return nextItems;
        });
    };
    const handleSolutionSnapshot = async () => {
        const photoUrl = captureViewRef.current
            ? await captureViewRef.current().catch(() => solutionUrl ?? '/inventory/camera.png')
            : (solutionUrl ?? '/inventory/camera.png');

        setInventoryItems((previousItems) => {
            const nextItems = [...previousItems];
            const photoCount = previousItems.filter((item) => item.type === 'Photo').length + 1;
            const photoItem = createPhotoInventoryItem(photoUrl, photoCount);
            nextItems.push(photoItem);
            return nextItems;
        });
    };

    const spawnOptions = tableau?.allKases().filter((kase) => kase.content === 'grass') ?? [];

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
                    <Suspense fallback={null}>

                    <PerspectiveCamera ref={cameraSolution} position={[gameMap.solution.x, 2, gameMap.solution.y]} />
                    <SceneCaptureBridge onCaptureReady={registerCaptureView} />

                    <Physics gravity={[0, -9.81, 0]}>
                        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75} />

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
                        <FPSPlayer position={playerPosition ?? new Vector3(gameMap.start.x, 2, gameMap.start.y)} />

                        <TableauToThreeContent mapToPlay={gameMap} callback={handleCameraClick}/>

                        <fog attach="fog" args={['#87CEEB', 10, 100]} />
                    </Physics>
                    </Suspense>
                </KeyboardControls>
                <group position={[-10, 25, 30]}  scale={[1,1,4]}>
                    <Cloud color={"white"}></Cloud>
                </group>
                <group position={[20, 25, -40]} scale={[3,3,4]}>
                    <Cloud  color={"#ffffff"}></Cloud>
                </group>
                <group position={[47, 25, 15]}  scale={[2,4,4]}>
                    <Cloud  color={"white"}></Cloud>
                </group>
            </Canvas>

            {solutionUrl ? <img src={solutionUrl} alt="Solution" className="solution-image" /> : null}
            <InventoryList items={inventoryItems} onCameraClick={handleCameraClick} />
        </div>
    );
}
