import { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import { KaseLandscape } from '@components/gameplay/landscape/service.ts';

const STORAGE_KEY = 'hexmap-editor-current-map';

/**
 * Sauvegarde une carte dans le localStorage pour la passer au mode Play
 */
export function saveMapForPlay(tableau: HexagonalTableau<KaseLandscape>): void {
  const allKases = tableau.allKases();
  
  const mapData = {
    width: tableau.sizeX,
    height: tableau.sizeY,
    cells: allKases.map((kase) => ({
      x: kase.x,
      y: kase.y,
      content: kase.content || 'zone',
      scale: kase.scale || 1,
    })),
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(mapData));
}

/**
 * Charge la carte depuis le localStorage pour le mode Play
 */
export function loadMapForPlay(): HexagonalTableau<KaseLandscape> | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  
  if (!stored) {
    return null;
  }

  try {
    const mapData = JSON.parse(stored);
    
    // Reconstruire le tableau
    const kases: KaseLandscape[][] = [];
    
    for (let x = 0; x < mapData.width; x++) {
      kases[x] = [];
      for (let y = 0; y < mapData.height; y++) {
        const kase = new KaseLandscape(x, y);
        kase.content = 'zone';
        kase.scale = 1;
        kases[x][y] = kase;
      }
    }
    
    // Remplir avec les données
    mapData.cells.forEach((cellData: any) => {
      if (kases[cellData.x] && kases[cellData.x][cellData.y]) {
        kases[cellData.x][cellData.y].content = cellData.content;
        kases[cellData.x][cellData.y].scale = cellData.scale;
      }
    });
    
    return new HexagonalTableau(kases);
  } catch (error) {
    console.error('Failed to load map:', error);
    return null;
  }
}

/**
 * Vérifie si une carte est disponible pour jouer
 */
export function hasMapForPlay(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

