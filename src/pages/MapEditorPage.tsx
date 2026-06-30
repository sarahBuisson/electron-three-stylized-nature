import { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HexagonMap } from '@components/map/HexagonMap';
import { MapSizeModal } from '@components/map/MapSizeModal';
import { initTableauAndLab, type KaseLandscape } from '@components/gameplay/landscape/service';
import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import { floodFill } from '@utils/floodFill';
import { createEmptyTableau, createTestTableau } from '@utils/mapGenerator';
import { MapToPlay, saveMapForPlay } from '@utils/mapPlayStorage';
import './MapEditorPage.css';
import { Euler, Vector2 } from 'three';
type ToolType = 'brush' | 'bucket';
const TERRAIN_TYPES = [
  { name: 'water', label: 'Water', color: '#4a90e2' },
  { name: 'mountain', label: 'Mountain', color: '#8b7355' },
  { name: 'tree', label: 'Tree', color: '#2d5016' },
  { name: 'rock', label: 'Rock', color: '#6b6b6b' },
  { name: 'sand', label: 'Sand', color: '#f4e4c1' },
  { name: 'grass', label: 'Grass', color: '#7cb342' },
];
export function MapEditorPage() {
  const navigate = useNavigate();
  const [type,setType] = useState<string>("drawing");
  const [tableau, setTableau] = useState<HexagonalTableau<KaseLandscape>>(() => initTableauAndLab());
  const [selectedTool, setSelectedTool] = useState<ToolType>('brush');
  const [selectedTerrain, setSelectedTerrain] = useState<string>('zone');
  const [selectedKase, setSelectedKase] = useState<KaseLandscape | null>(null);
  const [updateCounter, setUpdateCounter] = useState(0);
  const [showSizeModal, setShowSizeModal] = useState(false);
  // Force un re-render quand le tableau change
  const forceUpdate = useCallback(() => {
    setUpdateCounter((c) => c + 1);
  }, []);
  // Gestion du pinceau
  const handleBrushPaint = useCallback(
    (kase: KaseLandscape) => {
      if (selectedTool === 'brush') {
        kase.content = selectedTerrain;
        forceUpdate();
      }
    },
    [selectedTool, selectedTerrain, forceUpdate]
  );
  // Gestion du remplissage
  const handleKaseClick = useCallback(
    (kase: KaseLandscape) => {
      setSelectedKase(kase);
      if (selectedTool === 'bucket') {
        const originalContent = kase.content;
        if (originalContent === selectedTerrain) {
          return;
        }
        floodFill(
          tableau,
          kase,
          (k) => k.content === originalContent,
          (k) => {
            k.content = selectedTerrain;
          }
        );
        forceUpdate();
      }
    },
    [selectedTool, selectedTerrain, tableau, forceUpdate]
  );
  // Gestion de la création de nouvelle carte
  const handleCreateMap = useCallback(
    (width: number, height: number, usePattern: boolean) => {
      const newTableau = usePattern
        ? createTestTableau(width, height)
        : createEmptyTableau(width, height);
      setTableau(newTableau);
      setSelectedKase(null);
      forceUpdate();
    },
    [forceUpdate]
  );
  // Taille actuelle de la carte
  const mapSize = useMemo(
    () => ({
      width: tableau.sizeX,
      height: tableau.sizeY,
      total: tableau.allKases().length,
    }),
    [tableau]
  );
  // Gestion du mode Play
  const handlePlayMap = useCallback(() => {
    const kaseLandscapes = tableau.allKases().filter(kase => kase.content != 'mountain' && kase.content != 'tree');
    const start = kaseLandscapes[Math.floor(kaseLandscapes.length*Math.random())];
    const solution = kaseLandscapes[Math.floor( kaseLandscapes.length*Math.random() )];
    saveMapForPlay(new MapToPlay(tableau, new Vector2(start.x, start.y), new Vector2(solution.x, solution.y), new Euler(0, Math.random() * Math.PI, 0), type));
    navigate('/map-play');
  }, [tableau, navigate, type]);

  return (
    <div className="map-editor-page">
      <div className="map-editor-header">
        <h1>Hexagonal Map Editor</h1>
        <div className="header-buttons">
          <button className="play-button" onClick={handlePlayMap}>
            ▶️ Play Map
          </button>
          <button className="back-button" onClick={() => navigate('/menu')}>
            ← Back to Menu
          </button>
        </div>
      </div>
      <div className="map-editor-container">
        <div className="map-editor-sidebar">
          <section className="editor-section">
            <h2>Map Size</h2>
            <div className="map-size-info">
              <span className="size-label">
                {mapSize.width}×{mapSize.height} ({mapSize.total} cells)
              </span>

            </div>
            <h2>type</h2>
            <select value={type} onChange={(e) => {
              console.log("type", type, e.target.value);
              setType(e.target.value);
            }}>
              <option value="geometric">Geometric</option>
              <option value="drawing">Drawing</option>
            </select>
            {type}
          </section>
          <section className="editor-section">
            <h2>Tools</h2>
            <div className="tool-buttons">
              <button
                className={'tool-button ' + (selectedTool === 'brush' ? 'active' : '')}
                onClick={() => setSelectedTool('brush')}
                title="Brush (paint on drag)"
              >
                🖌️ Brush
              </button>
              <button
                className={'tool-button ' + (selectedTool === 'bucket' ? 'active' : '')}
                onClick={() => setSelectedTool('bucket')}
                title="Bucket (fill connected area)"
              >
                🪣 Bucket
              </button>
            </div>
          </section>
          <section className="editor-section">
            <h2>Terrain Types</h2>
            <div className="terrain-palette">
              {TERRAIN_TYPES.map((terrain) => (
                <button
                  key={terrain.name}
                  className={'terrain-button ' + (selectedTerrain === terrain.name ? 'active' : '')}
                  onClick={() => setSelectedTerrain(terrain.name)}
                  style={{
                    backgroundColor: terrain.color,
                    color: terrain.name === 'tree' || terrain.name === 'purple' ? '#fff' : '#000',
                  }}
                >
                  {terrain.label}
                </button>
              ))}
            </div>
          </section>
          {selectedKase && (
            <section className="editor-section">
              <h2>Selected Cell</h2>
              <div className="selected-info">
                <p>
                  <strong>Position:</strong> ({selectedKase.x}, {selectedKase.y})
                </p>
                <p>
                  <strong>Content:</strong> {selectedKase.content || 'none'}
                </p>
                <p>
                  <strong>Scale:</strong> {selectedKase.scale.toFixed(2)}
                </p>
              </div>
            </section>
          )}
        </div>
        <div className="map-editor-canvas">
          <div className="canvas-info">
            <span>Tool: {selectedTool === 'brush' ? '🖌️ Brush' : '🪣 Bucket'}</span>
            <span>Terrain: {selectedTerrain}</span>
            <span>Size: {mapSize.width}×{mapSize.height}</span>
          </div>
          <div className="map-container">
            <HexagonMap
              tableau={tableau}
              onKaseClick={handleKaseClick}
              onKasePaint={handleBrushPaint}
              hexSize={25}
              selectedKase={selectedKase}
            />
          </div>
        </div>
      </div>
      <MapSizeModal
        isOpen={showSizeModal}
        onClose={() => setShowSizeModal(false)}
        onConfirm={handleCreateMap}
        currentSize={{ width: mapSize.width, height: mapSize.height }}
      />
    </div>
  );
}
