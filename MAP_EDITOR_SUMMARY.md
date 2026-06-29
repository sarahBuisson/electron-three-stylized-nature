# 🗺️ Éditeur de Carte Hexagonale - Documentation Complète

## 📋 Résumé de l'Implémentation

Un éditeur de carte hexagonale complet a été créé avec des outils de peinture de type "éditeur d'image" pour éditer des `HexagonalTableau<KaseLandscape>`.

## 🎨 Fonctionnalités Principales

### Outils de Peinture

1. **🖌️ Brush Tool (Pinceau)**
   - Peinture case par case
   - Support du clic-et-glisser pour peindre plusieurs cases
   - Idéal pour les détails et corrections précises

2. **🪣 Bucket Tool (Remplissage)**
   - Remplissage par propagation (flood fill)
   - Remplit toutes les cases connectées du même type
   - Algorithme BFS (Breadth-First Search) optimisé

### Interface Utilisateur

- **Palette de Terrain** : 8 types de terrain avec aperçu couleur
- **Statistiques en Temps Réel** : Compteur de cases par type
- **Grille Hexagonale** : Affichage/masquage des coordonnées
- **Info de Sélection** : Position, contenu, et échelle de la case sélectionnée
- **Navigation Fluide** : Scroll pour explorer la carte

### Types de Terrain

| Type | Couleur | Usage |
|------|---------|-------|
| Zone | Beige clair (#e8d5b7) | Terrain par défaut |
| Water | Bleu (#4a90e2) | Eau, lacs, rivières |
| Mountain | Marron (#8b7355) | Montagnes, obstacles |
| Tree | Vert foncé (#2d5016) | Forêts |
| Rock | Gris (#6b6b6b) | Rochers |
| Sand | Beige (#f4e4c1) | Plages, déserts |
| Grass | Vert (#7cb342) | Prairies |
| Purple | Violet (#9c27b0) | Marqueurs spéciaux |

## 📁 Fichiers Créés

### Composants

#### 1. `src/components/map/HexagonMap.tsx`
**Rôle** : Composant d'affichage de la grille hexagonale en SVG

**Fonctionnalités** :
- Conversion coordonnées hexagonales → pixels
- Génération de polygones hexagonaux
- Gestion des événements souris (click, drag, hover)
- Affichage de la grille et des coordonnées
- Feedback visuel (hover, sélection)

**Props** :
```typescript
interface HexagonMapProps {
  tableau: HexagonalTableau<KaseLandscape>  // Tableau à afficher
  onKaseClick?: (kase: KaseLandscape) => void // Callback sur clic
  onKasePaint?: (kase: KaseLandscape) => void // Callback sur paint
  hexSize?: number                            // Taille des hexagones
  showGrid?: boolean                          // Afficher la grille
  selectedKase?: KaseLandscape | null         // Case sélectionnée
}
```

**Architecture** :
- Rendu SVG pour graphismes vectoriels nets
- Calcul memoïsé des positions pour performance
- Gestion d'état locale pour le painting
- Système de couleurs configurable

#### 2. `src/pages/MapEditorPage.tsx`
**Rôle** : Page complète de l'éditeur avec interface utilisateur

**État** :
```typescript
const [tableau, setTableau] = useState<HexagonalTableau<KaseLandscape>>()
const [selectedTool, setSelectedTool] = useState<'brush' | 'bucket'>()
const [selectedTerrain, setSelectedTerrain] = useState<string>()
const [selectedKase, setSelectedKase] = useState<KaseLandscape | null>()
const [showGrid, setShowGrid] = useState<boolean>()
```

**Sections UI** :
- Header avec bouton retour
- Sidebar gauche (outils, palette, options, stats)
- Canvas central (HexagonMap)
- Barre d'info en haut du canvas

**Interactivité** :
- Sélection d'outil avec feedback visuel
- Palette de terrain interactive
- Checkbox pour toggle la grille
- Statistiques dynamiques

#### 3. `src/pages/MapEditorPage.css`
**Rôle** : Styles de l'éditeur avec thème sombre

**Design** :
- Thème sombre (#1a1a1a background, #2a2a2a panels)
- Layout flexbox responsive
- Boutons avec états hover/active
- Scrollbars personnalisées
- Transitions fluides

### Utilitaires

#### 4. `src/utils/floodFill.ts`
**Rôle** : Algorithme de remplissage par propagation générique

**Fonction** :
```typescript
function floodFill<T extends Kase2D>(
  tableau: HexagonalTableau<T>,
  startKase: T,
  shouldFill: (kase: T) => boolean,
  onFill: (kase: T) => void
): void
```

**Algorithme** :
1. File (queue) avec case de départ
2. Set de cases visitées pour éviter boucles
3. Pour chaque case : marquer visitée, appliquer action, ajouter voisins
4. Continuer jusqu'à épuisement de la file

**Performance** :
- Complexité : O(n) où n = nombre de cases connectées
- Utilisation mémoire : O(n) pour le Set de visitées
- Pas de récursion → pas de stack overflow

#### 5. `src/utils/mapSerializer.ts`
**Rôle** : Fonctions d'export/import de cartes (feature future)

**Fonctions** :
```typescript
serializeMap(tableau, metadata)        // Tableau → JSON
downloadMap(tableau, filename)         // Télécharger JSON
copyMapToClipboard(tableau)           // Copier vers clipboard
parseMapJSON(json)                    // JSON → données
loadMapFromFile(file)                 // Charger depuis fichier
getMapStatistics(tableau)             // Statistiques de la carte
```

**Format JSON** :
```json
{
  "width": 20,
  "height": 20,
  "cells": [
    { "x": 0, "y": 0, "content": "zone", "scale": 1 }
  ],
  "metadata": {
    "name": "Map Name",
    "author": "Author",
    "created": "2026-06-22...",
    "description": "..."
  }
}
```

### Storybook

#### 6. `src/components/map/HexagonMap.stories.tsx`
**Rôle** : Stories Storybook pour tester HexagonMap

**Stories** :
- **SmallMap** : Petite carte 5×5
- **MediumMap** : Carte moyenne 10×10
- **LargeRandomMap** : Grande carte aléatoire
- **NoGrid** : Sans grille
- **Interactive** : Avec callbacks console.log
- **SmallHexagons** : Hexagones de taille 15
- **LargeHexagons** : Hexagones de taille 60

**Classe Helper** :
```typescript
class SimpleKaseLandscape extends Kase2D implements KaseLandscape {
  content?: string
  scale: number = 1
}
```

### Documentation

#### 7. `src/components/map/README.md`
**Contenu** : Documentation technique du composant
- Architecture hexagonale
- Système de coordonnées
- Algorithmes utilisés
- Guide d'intégration

#### 8. `GUIDE_EDITEUR_CARTE.md`
**Contenu** : Guide utilisateur complet
- Instructions d'utilisation
- Workflow de peinture
- Cas d'usage
- Troubleshooting

#### 9. `EXPORT_IMPORT_GUIDE.md`
**Contenu** : Guide d'implémentation export/import
- Code snippets prêts à copier
- Exemples de reconstruction de tableau
- Features avancées (undo/redo, auto-save)

## 🔄 Intégration avec l'Application

### Routing

**Route ajoutée** : `/map-editor`

**Fichiers modifiés** :

1. **`src/App.tsx`**
```typescript
import { MapEditorPage } from '@pages/MapEditorPage'

<Route path="/map-editor" element={<MapEditorPage />} />
```

2. **`src/config/menuConfig.ts`**
```typescript
export type MenuActionId = ... | 'map-editor' | ...

export const MENU_ITEMS: MenuItem[] = [
  { id: 'map-editor', label: 'Editeur de Carte' },
  ...
]
```

3. **`src/pages/MenuPage.tsx`**
```typescript
case 'map-editor':
  navigate('/map-editor')
  break
```

### Navigation

**Menu Principal** → Bouton "Editeur de Carte" → Page `/map-editor`

**Retour** : Bouton "← Back to Menu" → `/menu`

## 🎯 Architecture Technique

### Système Hexagonal

**Type de grille** : Flat-topped hexagons (hexagones à sommet plat)

**Coordonnées** : Système axial (x, y)

**Voisinage** :
```
Un hexagone (x, y) a 6 voisins :
  (x-1, y)   (x+1, y)      ← Horizontal
  (x-1, y+1) (x, y+1)      ← Bas
  (x, y-1)   (x+1, y-1)    ← Haut
```

**Conversion hex → pixel** :
```typescript
pixelX = size * (√3 * x + (√3/2) * y)
pixelY = size * (3/2) * y
```

### Rendu SVG

**Avantages** :
- Graphismes vectoriels → net à toute taille
- Manipulation DOM facile pour interactions
- CSS et transitions natives
- Pas de problème de pixelisation

**Structure** :
```xml
<svg viewBox="...">
  <g key="x-y">
    <polygon points="..." />     <!-- Hexagone -->
    <polygon points="..." />     <!-- Outline si sélectionné -->
    <polygon points="..." />     <!-- Hover effect -->
    <text>x,y</text>             <!-- Coordonnées -->
  </g>
</svg>
```

### Gestion d'État

**Pattern utilisé** : State local + force update

```typescript
const [updateCounter, setUpdateCounter] = useState(0)
const forceUpdate = () => setUpdateCounter(c => c + 1)

// Après modification
kase.content = newValue
forceUpdate()  // Re-render car tableau muté
```

**Pourquoi** :
- HexagonalTableau utilise structure mutable
- Force update nécessaire après mutation
- Alternative : state immutable avec spread operator (plus coûteux)

### Performance

**Optimisations** :
- `useMemo` pour calculs de dimensions
- `useMemo` pour génération des hexagones
- `useCallback` pour event handlers
- Minimal re-renders avec updateCounter

**Scalabilité** :
- Testé avec tableaux 10×10 (100 cases) : Fluide
- Testé avec tableaux 20×20 (400 cases) : Correct
- Au-delà recommandé : Canvas au lieu de SVG

## 🚀 Utilisation

### Démarrage

```bash
npm run dev
```

Puis :
1. Cliquez sur "Editeur de Carte" dans le menu
2. Sélectionnez un outil (Brush ou Bucket)
3. Choisissez un type de terrain
4. Peignez la carte !

### Storybook

```bash
npm run storybook
```

Puis naviguez vers **Map → HexagonMap** pour tester les stories.

## 🔮 Features Futures

### Priorité Haute
- [ ] Export/Import JSON (code déjà disponible dans mapSerializer.ts)
- [ ] Undo/Redo (exemple dans EXPORT_IMPORT_GUIDE.md)
- [ ] Auto-save vers localStorage

### Priorité Moyenne
- [ ] Eyedropper tool (pipette pour copier type de terrain)
- [ ] Selection tools (rectangle, circle)
- [ ] Clear map (réinitialiser)
- [ ] Resize map dimensions

### Priorité Basse
- [ ] Custom terrain types
- [ ] Layer system (terrain, objects, decorations)
- [ ] Procedural generation tools
- [ ] 3D preview integration

## 📚 Exemples de Code

### Créer un Tableau Personnalisé

```typescript
import { HexagonalTableau } from '@services/game/labyrinth/tableau'
import { KaseLandscape } from '@components/gameplay/landscape/service'

const kases: KaseLandscape[][] = []

for (let x = 0; x < 10; x++) {
  kases[x] = []
  for (let y = 0; y < 10; y++) {
    const kase = new KaseLandscape(x, y)
    kase.content = 'zone'
    kase.scale = 1
    kases[x][y] = kase
  }
}

const tableau = new HexagonalTableau(kases)
```

### Utiliser HexagonMap

```tsx
import { HexagonMap } from '@components/map/HexagonMap'

<HexagonMap
  tableau={myTableau}
  hexSize={30}
  showGrid={true}
  onKaseClick={(kase) => console.log('Clicked', kase)}
  onKasePaint={(kase) => console.log('Painted', kase)}
  selectedKase={selectedKase}
/>
```

### Flood Fill Personnalisé

```typescript
import { floodFill } from '@utils/floodFill'

// Remplir toutes les cases "water" par "ice"
floodFill(
  tableau,
  startKase,
  (kase) => kase.content === 'water',
  (kase) => { kase.content = 'ice' }
)
```

## 🧪 Tests

### Validation Manuelle

1. ✅ Brush tool peint case par case
2. ✅ Brush tool peint en glissant
3. ✅ Bucket fill remplit zone connectée
4. ✅ Bucket ne remplit pas si même couleur
5. ✅ Hover affiche feedback visuel
6. ✅ Clic sélectionne case
7. ✅ Statistiques mises à jour en temps réel
8. ✅ Toggle grid fonctionne
9. ✅ Navigation retour au menu
10. ✅ Aucune erreur TypeScript

### Storybook Tests

Seven stories créées testant différents scénarios :
- Petites/moyennes/grandes cartes
- Avec/sans grille
- Différentes tailles d'hexagones
- Interactivité avec callbacks

## 🎉 Résultat Final

Un éditeur de carte hexagonale professionnel et complet avec :

✅ Interface utilisateur intuitive
✅ Outils de peinture puissants
✅ Visualisation claire et nette
✅ Code modulaire et réutilisable
✅ Documentation exhaustive
✅ Stories Storybook pour tests
✅ Prêt pour extension (export/import)
✅ Aucune erreur de compilation

**L'éditeur est opérationnel et prêt à l'emploi !** 🚀

