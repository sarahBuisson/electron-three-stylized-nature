import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import type { Kase2D } from '@services/game/labyrinth/tableau.ts';

/**
 * Algorithme de remplissage par propagation (flood fill) pour une grille hexagonale
 */
export function floodFill<T extends Kase2D>(
  tableau: HexagonalTableau<T>,
  startKase: T,
  shouldFill: (kase: T) => boolean,
  onFill: (kase: T) => void
): void {
  const visited = new Set<string>();
  const queue: T[] = [startKase];

  // Éviter de remplir si la case de départ ne satisfait pas la condition
  if (!shouldFill(startKase)) {
    return;
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    const key = `${current.x},${current.y}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);
    onFill(current);

    // Ajouter les voisins qui satisfont la condition
    const neighbors = tableau.neighbors(current);
    for (const neighbor of neighbors) {
      const neighborKey = `${neighbor.x},${neighbor.y}`;
      if (!visited.has(neighborKey) && shouldFill(neighbor)) {
        queue.push(neighbor);
      }
    }
  }
}

