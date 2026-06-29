import { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import { KaseLandscape } from '@components/gameplay/landscape/service.ts';

export interface MapSizePreset {
  name: string;
  width: number;
  height: number;
  description: string;
}

export const MAP_SIZE_PRESETS: MapSizePreset[] = [
  { name: 'Tiny', width: 5, height: 5, description: '5×5 - Tests rapides' },
  { name: 'Small', width: 10, height: 10, description: '10×10 - Petite map' },
  { name: 'Medium', width: 20, height: 20, description: '20×20 - Map moyenne' },
  { name: 'Large', width: 30, height: 30, description: '30×30 - Grande map' },
  { name: 'Huge', width: 50, height: 50, description: '50×50 - Très grande' },
];

/**
 * Crée un tableau hexagonal vide avec des dimensions spécifiques
 */
export function createEmptyTableau(width: number, height: number): HexagonalTableau<KaseLandscape> {
  const kases: KaseLandscape[][] = [];

  for (let x = 0; x < width; x++) {
    kases[x] = [];
    for (let y = 0; y < height; y++) {
      const kase = new KaseLandscape(x, y);
      kase.content = 'zone';
      kase.scale = 1;
      kases[x][y] = kase;
    }
  }

  return new HexagonalTableau(kases);
}

/**
 * Crée un tableau hexagonal avec un pattern de test
 */
export function createTestTableau(width: number, height: number): HexagonalTableau<KaseLandscape> {
  const tableau = createEmptyTableau(width, height);

  // Ajouter un pattern simple pour visualiser
  const centerX = Math.floor(width / 2);
  const centerY = Math.floor(height / 2);

  // Bordures en montagne
  for (let x = 0; x < width; x++) {
    const topKase = tableau.getKase(x, 0);
    const bottomKase = tableau.getKase(x, height - 1);
    if (topKase) topKase.content = 'mountain';
    if (bottomKase) bottomKase.content = 'mountain';
  }

  for (let y = 0; y < height; y++) {
    const leftKase = tableau.getKase(0, y);
    const rightKase = tableau.getKase(width - 1, y);
    if (leftKase) leftKase.content = 'mountain';
    if (rightKase) rightKase.content = 'mountain';
  }

  // Lac au centre
  const radius = Math.min(width, height) / 6;
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < radius) {
        const kase = tableau.getKase(x, y);
        if (kase) kase.content = 'water';
      }
    }
  }

  // Quelques arbres aléatoires
  const treeCount = Math.floor(width * height * 0.05);
  for (let i = 0; i < treeCount; i++) {
    const kase = tableau.randomKase();
    if (kase.content === 'zone') {
      kase.content = 'tree';
    }
  }

  return tableau;
}

/**
 * Valide les dimensions d'une carte
 */
export function validateMapSize(width: number, height: number): {
  valid: boolean;
  error?: string;
} {
  if (width < 3 || height < 3) {
    return { valid: false, error: 'Minimum size is 3×3' };
  }

  if (width > 100 || height > 100) {
    return { valid: false, error: 'Maximum size is 100×100' };
  }

  if (width * height > 2500) {
    return {
      valid: false,
      error: 'Map too large (max 2500 cells). Consider reducing dimensions.',
    };
  }

  return { valid: true };
}
