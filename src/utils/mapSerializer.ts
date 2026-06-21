import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';

/**
 * Interface pour l'export/import de cartes hexagonales
 */
export interface SerializedMap {
  width: number;
  height: number;
  cells: Array<{
    x: number;
    y: number;
    content: string;
    scale: number;
  }>;
  metadata?: {
    name?: string;
    author?: string;
    created?: string;
    description?: string;
  };
}

/**
 * Exporte un HexagonalTableau vers un format JSON sérialisable
 */
export function serializeMap(
  tableau: HexagonalTableau<KaseLandscape>,
  metadata?: SerializedMap['metadata']
): SerializedMap {
  const allKases = tableau.allKases();

  return {
    width: tableau.sizeX,
    height: tableau.sizeY,
    cells: allKases.map((kase) => ({
      x: kase.x,
      y: kase.y,
      content: kase.content || 'zone',
      scale: kase.scale || 1,
    })),
    metadata: {
      ...metadata,
      created: new Date().toISOString(),
    },
  };
}

/**
 * Télécharge une carte au format JSON
 */
export function downloadMap(
  tableau: HexagonalTableau<KaseLandscape>,
  filename: string = 'hexmap.json',
  metadata?: SerializedMap['metadata']
): void {
  const serialized = serializeMap(tableau, metadata);
  const json = JSON.stringify(serialized, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();

  URL.revokeObjectURL(url);
}

/**
 * Copie une carte au format JSON dans le presse-papiers
 */
export async function copyMapToClipboard(
  tableau: HexagonalTableau<KaseLandscape>,
  metadata?: SerializedMap['metadata']
): Promise<void> {
  const serialized = serializeMap(tableau, metadata);
  const json = JSON.stringify(serialized, null, 2);

  await navigator.clipboard.writeText(json);
}

/**
 * Parse un JSON et retourne les données de la carte
 * Note: Cette fonction retourne uniquement les données.
 * La reconstruction du tableau doit être faite ailleurs.
 */
export function parseMapJSON(json: string): SerializedMap {
  const data = JSON.parse(json) as SerializedMap;

  // Validation basique
  if (!data.width || !data.height || !Array.isArray(data.cells)) {
    throw new Error('Invalid map format');
  }

  return data;
}

/**
 * Charge une carte depuis un fichier
 */
export function loadMapFromFile(file: File): Promise<SerializedMap> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = parseMapJSON(json);
        resolve(data);
      } catch (error) {
        reject(new Error('Failed to parse map file: ' + error));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

/**
 * Statistiques d'une carte
 */
export function getMapStatistics(tableau: HexagonalTableau<KaseLandscape>): {
  totalCells: number;
  terrainCounts: Record<string, number>;
  terrainPercentages: Record<string, number>;
} {
  const allKases = tableau.allKases();
  const totalCells = allKases.length;
  const terrainCounts: Record<string, number> = {};

  allKases.forEach((kase) => {
    const content = kase.content || 'unknown';
    terrainCounts[content] = (terrainCounts[content] || 0) + 1;
  });

  const terrainPercentages: Record<string, number> = {};
  Object.entries(terrainCounts).forEach(([terrain, count]) => {
    terrainPercentages[terrain] = (count / totalCells) * 100;
  });

  return {
    totalCells,
    terrainCounts,
    terrainPercentages,
  };
}

/**
 * Exemple d'utilisation:
 *
 * // Export
 * const mapData = serializeMap(tableau, { name: 'My Cool Map', author: 'John' });
 * downloadMap(tableau, 'my-map.json', { name: 'My Cool Map' });
 *
 * // Import
 * const file = event.target.files[0];
 * const mapData = await loadMapFromFile(file);
 * // Puis reconstruire le tableau à partir de mapData.cells
 *
 * // Stats
 * const stats = getMapStatistics(tableau);
 * console.log(`Total cells: ${stats.totalCells}`);
 * console.log(`Water: ${stats.terrainPercentages.water}%`);
 */

