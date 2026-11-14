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
import { computeAveragePositionHexa } from '@components/gameplay/landscape/hexPosition.ts';
import { findCentralSpawn, findRandomSpawn, randomSpawnDirection } from '@components/gameplay/landscape/playerSpawn.ts';
import { type SolutionPose } from '@components/gameplay/landscape/solutionMatch.ts';
import { SolutionWatcher } from '@components/gameplay/landscape/SolutionWatcher.tsx';
import { FPSPlayer, type FPSPlayerHandle } from '@components/gameplay/controller/FPSPlayer';
import { KEYBIND_PRESETS, type KeybindPresetType } from '@config/keybindPresets.ts';
import { GroundPlane } from '@components/gameplay/oldGameplay/GroundPlane.tsx';
import { InventoryList } from '@components/gameplay/inventory/InventoryList';
import { createPhotoInventoryItem, readInventory, type InventoryItem, writeInventory } from '@components/gameplay/inventory/inventory.model';
import './MapPlayPage.css';
import { type PerspectiveCamera as PerspectiveCameraType } from 'three';
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
    const spawn = useMemo(() => initialMap ? findCentralSpawn(initialMap.tableau) : null, [initialMap]);
    const error = !initialMap
        ? 'No map available to play. Please create a map in the editor first.'
        : !spawn ? 'The map needs at least one tile without a tree or mountain to start playing.' : null;
    const [solutionUrl] = useState<string | null>('./inventory/camera.png');
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(() => readInventory('./inventory/camera.png'));
    const [flashId, setFlashId] = useState(0);
    const [solution, setSolution] = useState<SolutionPose | null>(null);
    const [won, setWon] = useState(false);
    const playerPosition = useMemo(() => {
        if (!spawn) return null;
        const position = computeAveragePositionHexa(1, [spawn]);
        position.y = 2;
        return position;
    }, [spawn]);
    const cameraSolution = useRef<PerspectiveCameraType | null>(null);
    const captureViewRef = useRef<(() => Promise<string>) | null>(null);
    const playerRef = useRef<FPSPlayerHandle>(null);
    const keybinds = KEYBIND_PRESETS.WASD;
    const [keybindPreset, setKeybindPreset] = useState<KeybindPresetType>('WASD')
    const registerCaptureView = useCallback((capture: () => Promise<string>) => {
        captureViewRef.current = capture;
    }, []);

    useEffect(() => {
        writeInventory(inventoryItems);
        console.log("inventoryItems", inventoryItems);
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

    function computeRandomFreePosition() {
        if (!tableau) throw new Error('Cannot initialize the game without a map.');
        const randomSpawn = findRandomSpawn(tableau);
        if (!randomSpawn) throw new Error('Cannot place the player: no suitable tile is available.');
        if (!playerRef.current) throw new Error('Cannot place the player before it is ready.');
        const position = computeAveragePositionHexa(1, [randomSpawn]);
        position.y = 2;
        return position;
    }

    const initGame = async () => {
        setSolution(null);
        setWon(false);
        const positionSolution = computeRandomFreePosition();
        const directionSolution = randomSpawnDirection();
        playerRef.current?.moveTo(positionSolution, directionSolution);

        await handleCameraClick();
        const position = computeRandomFreePosition();
        playerRef.current?.moveTo(position, randomSpawnDirection());
        setSolution({ position: positionSolution, yaw: directionSolution });
    }

    const handleWin = useCallback(() => {
        if (document.pointerLockElement) document.exitPointerLock();
        setWon(true);
    }, []);

    const handleCameraClick = async () => {
         const photoUrl = captureViewRef.current
            ? await captureViewRef.current().catch(() => solutionUrl ?? '/inventory/camera.png')
            : (solutionUrl ?? '/inventory/camera.png');
        setFlashId((id) => id + 1);

        setInventoryItems((previousItems) => {
            const nextItems = [...previousItems];
            const photoCount = previousItems.filter((item) => item.type === 'Photo').length + 1;
            const photoItem = createPhotoInventoryItem(photoUrl, photoCount);
            nextItems.push(photoItem);
            console.log("handleCameraClick", nextItems);
            return nextItems;
        });
    };

    if (error) {
        return (
            <div className="map-play-error">
                <div className="error-content">
                    <h1>Cannot Play Map</h1>
                    <p>{error}</p>
                    <button onClick={() => navigate('/map-editor')}>
                        Return to Editor
                    </button>
                </div>
            </div>
        );
    }

    if (!tableau || !gameMap || !playerPosition) {
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
                        <FPSPlayer ref={playerRef} position={playerPosition} />
                        {solution && (
                            <mesh position={[solution.position.x, 0.15, solution.position.z]}>
                                <boxGeometry args={[0.3, 0.3, 0.3]} />
                                <meshStandardMaterial color="#ff69b4" />
                            </mesh>
                        )}
                        {solution && !won && <SolutionWatcher solution={solution} onWin={handleWin} />}

                        <TableauToThreeContent mapToPlay={gameMap} callback={initGame}/>

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
            {flashId > 0 && <div key={flashId} className="camera-flash" aria-hidden="true" />}
            {won && (
                <div className="win-overlay" role="dialog" aria-modal="true" aria-labelledby="win-title">
                    <div className="win-popup">
                        <h1 id="win-title">Win!</h1>
                        <button type="button" autoFocus onClick={() => navigate('/map-editor')}>Return to Editor</button>
                    </div>
                </div>
            )}
        </div>
    );
}
