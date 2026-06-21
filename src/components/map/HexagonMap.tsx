import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';

interface HexagonMapProps {
  tableau: HexagonalTableau<KaseLandscape>;
  onKaseClick?: (kase: KaseLandscape) => void;
  onKasePaint?: (kase: KaseLandscape) => void;
  hexSize?: number;
  showGrid?: boolean;
  selectedKase?: KaseLandscape | null;
}

// Calcul des coordonnées hexagonales
function hexToPixel(x: number, y: number, size: number): { x: number; y: number } {
  const pixelX = size * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * y);
  const pixelY = size * (3 / 2) * y;
  return { x: pixelX, y: pixelY };
}

// Génération des points d'un hexagone
function hexagonPoints(cx: number, cy: number, size: number): string {
  const points: string[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const x = cx + size * Math.cos(angle);
    const y = cy + size * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

// Couleurs par type de contenu
const CONTENT_COLORS: Record<string, string> = {
  zone: '#e8d5b7',
  water: '#4a90e2',
  mountain: '#8b7355',
  tree: '#2d5016',
  rock: '#6b6b6b',
  sand: '#f4e4c1',
  grass: '#7cb342',
  purple: '#9c27b0',
  default: '#cccccc',
};

export function HexagonMap({
  tableau,
  onKaseClick,
  onKasePaint,
  hexSize = 30,
  showGrid = true,
  selectedKase = null,
}: HexagonMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isPainting, setIsPainting] = useState(false);
  const [hoveredKase, setHoveredKase] = useState<KaseLandscape | null>(null);

  // Calcul des dimensions du SVG
  const { minX, maxX, minY, maxY } = useMemo(() => {
    const allKases = tableau.allKases();
    let minX = Infinity,
      maxX = -Infinity,
      minY = Infinity,
      maxY = -Infinity;

    allKases.forEach((kase) => {
      const { x, y } = hexToPixel(kase.x, kase.y, hexSize);
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });

    const padding = hexSize * 2;

    return {
      minX: minX - padding,
      maxX: maxX + padding,
      minY: minY - padding,
      maxY: maxY + padding,
    };
  }, [tableau, hexSize]);

  const viewBox = `${minX} ${minY} ${maxX - minX} ${maxY - minY}`;

  // Gestion du painting
  useEffect(() => {
    const handleMouseUp = () => setIsPainting(false);
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  const handleKaseMouseDown = useCallback(
    (kase: KaseLandscape) => {
      setIsPainting(true);
      onKaseClick?.(kase);
      onKasePaint?.(kase);
    },
    [onKaseClick, onKasePaint]
  );

  const handleKaseMouseEnter = useCallback(
    (kase: KaseLandscape) => {
      setHoveredKase(kase);
      if (isPainting) {
        onKasePaint?.(kase);
      }
    },
    [isPainting, onKasePaint]
  );

  const handleKaseMouseLeave = useCallback(() => {
    setHoveredKase(null);
  }, []);

  // Rendu des hexagones
  const hexagons = useMemo(() => {
    return tableau.allKases().map((kase) => {
      const { x, y } = hexToPixel(kase.x, kase.y, hexSize);
      const points = hexagonPoints(x, y, hexSize);
      const color = CONTENT_COLORS[kase.content || 'default'] || CONTENT_COLORS.default;
      const isSelected = selectedKase === kase;
      const isHovered = hoveredKase === kase;

      return (
        <g key={`${kase.x}-${kase.y}`}>
          <polygon
            points={points}
            fill={color}
            stroke={showGrid ? '#333' : 'none'}
            strokeWidth={showGrid ? 1 : 0}
            style={{
              cursor: 'pointer',
              opacity: isSelected ? 0.8 : 1,
              transition: 'opacity 0.1s',
            }}
            onMouseDown={() => handleKaseMouseDown(kase)}
            onMouseEnter={() => handleKaseMouseEnter(kase)}
            onMouseLeave={handleKaseMouseLeave}
          />
          {isSelected && (
            <polygon
              points={points}
              fill="none"
              stroke="#ff0000"
              strokeWidth={3}
              pointerEvents="none"
            />
          )}
          {isHovered && !isSelected && (
            <polygon
              points={points}
              fill="white"
              opacity={0.3}
              pointerEvents="none"
            />
          )}
          {showGrid && (
            <text
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="#000"
              opacity={0.5}
              pointerEvents="none"
            >
              {kase.x},{kase.y}
            </text>
          )}
        </g>
      );
    });
  }, [
    tableau,
    hexSize,
    showGrid,
    selectedKase,
    hoveredKase,
    handleKaseMouseDown,
    handleKaseMouseEnter,
    handleKaseMouseLeave,
  ]);

  return (
    <svg
      ref={svgRef}
      viewBox={viewBox}
      style={{
        width: '100%',
        height: '100%',
        userSelect: 'none',
      }}
    >
      {hexagons}
    </svg>
  );
}


