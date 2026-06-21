import { useState } from 'react';
import { MAP_SIZE_PRESETS, validateMapSize, type MapSizePreset } from '@utils/mapGenerator';
import './MapSizeModal.css';

interface MapSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (width: number, height: number, usePattern: boolean) => void;
  currentSize?: { width: number; height: number };
}

export function MapSizeModal({ isOpen, onClose, onConfirm, currentSize }: MapSizeModalProps) {
  const [selectedPreset, setSelectedPreset] = useState<MapSizePreset | null>(null);
  const [customWidth, setCustomWidth] = useState(currentSize?.width || 20);
  const [customHeight, setCustomHeight] = useState(currentSize?.height || 20);
  const [usePattern, setUsePattern] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePresetClick = (preset: MapSizePreset) => {
    setSelectedPreset(preset);
    setCustomWidth(preset.width);
    setCustomHeight(preset.height);
    setError(null);
  };

  const handleCustomWidthChange = (value: number) => {
    setCustomWidth(value);
    setSelectedPreset(null);
    setError(null);
  };

  const handleCustomHeightChange = (value: number) => {
    setCustomHeight(value);
    setSelectedPreset(null);
    setError(null);
  };

  const handleConfirm = () => {
    const validation = validateMapSize(customWidth, customHeight);

    if (!validation.valid) {
      setError(validation.error || 'Invalid map size');
      return;
    }

    onConfirm(customWidth, customHeight, usePattern);
    onClose();
  };

  const totalCells = customWidth * customHeight;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Choose Map Size</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          <section className="modal-section">
            <h3>Presets</h3>
            <div className="preset-grid">
              {MAP_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  className={`preset-button ${
                    selectedPreset?.name === preset.name ? 'active' : ''
                  }`}
                  onClick={() => handlePresetClick(preset)}
                >
                  <div className="preset-name">{preset.name}</div>
                  <div className="preset-size">
                    {preset.width}×{preset.height}
                  </div>
                  <div className="preset-description">{preset.description}</div>
                </button>
              ))}
            </div>
          </section>

          <section className="modal-section">
            <h3>Custom Size</h3>
            <div className="custom-inputs">
              <div className="input-group">
                <label htmlFor="width">Width</label>
                <input
                  id="width"
                  type="number"
                  min="3"
                  max="100"
                  value={customWidth}
                  onChange={(e) => handleCustomWidthChange(parseInt(e.target.value) || 3)}
                />
              </div>
              <span className="input-separator">×</span>
              <div className="input-group">
                <label htmlFor="height">Height</label>
                <input
                  id="height"
                  type="number"
                  min="3"
                  max="100"
                  value={customHeight}
                  onChange={(e) => handleCustomHeightChange(parseInt(e.target.value) || 3)}
                />
              </div>
            </div>

            <div className="size-info">
              <span>Total cells: {totalCells}</span>
              {totalCells > 1000 && (
                <span className="warning">⚠️ Large map - may affect performance</span>
              )}
            </div>
          </section>

          <section className="modal-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={usePattern}
                onChange={(e) => setUsePattern(e.target.checked)}
              />
              <span>Generate test pattern (borders, lake, trees)</span>
            </label>
          </section>

          {error && (
            <div className="error-message">
              <span>❌ {error}</span>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-button cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-button confirm" onClick={handleConfirm}>
            Create Map {customWidth}×{customHeight}
          </button>
        </div>
      </div>
    </div>
  );
}

