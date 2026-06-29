# Map Size Feature - Documentation

## 🎯 Fonctionnalité Ajoutée

Possibilité de choisir la taille de la carte hexagonale dans l'éditeur.

## 📁 Nouveaux Fichiers

### 1. `src/utils/mapGenerator.ts`
**Rôle** : Utilitaires pour générer des cartes de différentes tailles

**Fonctions** :
- `createEmptyTableau(width, height)` - Crée un tableau vide
- `createTestTableau(width, height)` - Crée un tableau avec un pattern de test
- `validateMapSize(width, height)` - Valide les dimensions

**Presets disponibles** :
```typescript
const MAP_SIZE_PRESETS = [
  { name: 'Tiny', width: 5, height: 5 },
  { name: 'Small', width: 10, height: 10 },
  { name: 'Medium', width: 20, height: 20 },
  { name: 'Large', width: 30, height: 30 },
  { name: 'Huge', width: 50, height: 50 },
]
```

**Pattern de Test** :
- Bordures en montagne
- Lac circulaire au centre
- Arbres aléatoires (5% des cases)

### 2. `src/components/map/MapSizeModal.tsx`
**Rôle** : Modal de sélection de taille de carte

**Props** :
```typescript
interface MapSizeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (width: number, height: number, usePattern: boolean) => void
  currentSize?: { width: number; height: number }
}
```

**Features** :
- 5 presets prédéfinis (Tiny à Huge)
- Dimensions personnalisées (3×3 à 100×100)
- Affichage du nombre total de cases
- Warning si >1000 cases (performance)
- Validation des dimensions
- Option "Generate test pattern"

### 3. `src/components/map/MapSizeModal.css`
Styles pour le modal avec :
- Overlay avec fade-in
- Modal animé (slide-up)
- Grille de presets responsive
- Inputs personnalisés
- Messages d'erreur stylisés

## 🎨 Interface Utilisateur

### Section "Map Size" (Sidebar)
```
┌──────────────────────┐
│ Map Size             │
│ ┌──────────────────┐ │
│ │ 20×20 (400 cells)│ │
│ └──────────────────┘ │
│ ┌──────────────────┐ │
│ │ 📐 Resize Map    │ │
│ └──────────────────┘ │
└──────────────────────┘
```

### Modal "Choose Map Size"
```
┌──────────────────────────────────────┐
│ Choose Map Size                    ✕ │
├──────────────────────────────────────┤
│                                      │
│ Presets                              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐│
│ │ Tiny │ │Small │ │Medium│ │Large ││
│ │ 5×5  │ │10×10 │ │20×20 │ │30×30 ││
│ └──────┘ └──────┘ └──────┘ └──────┘│
│ ┌──────┐                            │
│ │ Huge │                            │
│ │50×50 │                            │
│ └──────┘                            │
│                                      │
│ Custom Size                          │
│ ┌──────┐   ┌──────┐                │
│ │Width │ × │Height│                │
│ │  20  │   │  20  │                │
│ └──────┘   └──────┘                │
│ Total cells: 400                    │
│                                      │
│ ☑ Generate test pattern              │
│                                      │
├──────────────────────────────────────┤
│               [Cancel] [Create Map]  │
└──────────────────────────────────────┘
```

## 🔧 Utilisation

### 1. Ouvrir le Modal
Cliquez sur le bouton **"📐 Resize Map"** dans la sidebar

### 2. Choisir une Taille

#### Option A : Utiliser un Preset
- Cliquez sur un preset (Tiny, Small, Medium, Large, Huge)
- Le preset est mis en surbrillance
- Les dimensions sont appliquées automatiquement

#### Option B : Dimensions Personnalisées
- Entrez la largeur (Width) : 3-100
- Entrez la hauteur (Height) : 3-100
- Le total de cases est calculé automatiquement

### 3. Pattern de Test (Optionnel)
- Cochez **"Generate test pattern"** pour :
  - Bordures en montagne
  - Lac au centre
  - Arbres aléatoires

- Décochez pour une carte vide (toutes cases = "zone")

### 4. Créer la Carte
- Cliquez sur **"Create Map"**
- La carte est générée instantanément
- L'ancienne carte est remplacée

## 📊 Validation

### Limites
- **Minimum** : 3×3 (9 cases)
- **Maximum** : 100×100 (10,000 cases)
- **Total max** : 2500 cases (limitation performance)

### Messages d'Erreur
- `"Minimum size is 3×3"` - Dimensions trop petites
- `"Maximum size is 100×100"` - Dimensions trop grandes
- `"Map too large (max 2500 cells)"` - Trop de cases au total

### Warnings
- **⚠️ Large map** - Affiché si >1000 cases (peut ralentir)

## 💡 Exemples

### Petite Carte de Test
```
Width: 5
Height: 5
Pattern: ✓
→ Carte 5×5 avec bordures et petit lac
```

### Grande Carte Vide
```
Width: 30
Height: 30
Pattern: ✗
→ Carte 30×30 entièrement vide (prête à peindre)
```

### Carte Rectangulaire
```
Width: 40
Height: 20
Pattern: ✓
→ Carte 40×20 avec pattern adapté
```

## 🚀 Code Interne

### Création de Tableau Vide
```typescript
function createEmptyTableau(width: number, height: number) {
  const kases: KaseLandscape[][] = []
  
  for (let x = 0; x < width; x++) {
    kases[x] = []
    for (let y = 0; y < height; y++) {
      const kase = new KaseLandscape(x, y)
      kase.content = 'zone'
      kase.scale = 1
      kases[x][y] = kase
    }
  }
  
  return new HexagonalTableau(kases)
}
```

### Création avec Pattern
```typescript
function createTestTableau(width: number, height: number) {
  const tableau = createEmptyTableau(width, height)
  
  // Bordures en montagne
  for (let x = 0; x < width; x++) {
    tableau.getKase(x, 0).content = 'mountain'
    tableau.getKase(x, height - 1).content = 'mountain'
  }
  
  // Lac circulaire au centre
  const centerX = Math.floor(width / 2)
  const centerY = Math.floor(height / 2)
  const radius = Math.min(width, height) / 6
  
  // ... calcul de distance et remplissage
  
  return tableau
}
```

### Handler dans MapEditorPage
```typescript
const handleCreateMap = useCallback(
  (width: number, height: number, usePattern: boolean) => {
    const newTableau = usePattern
      ? createTestTableau(width, height)
      : createEmptyTableau(width, height)

    setTableau(newTableau)
    setSelectedKase(null)
    forceUpdate()
  },
  [forceUpdate]
)
```

## 🎯 Cas d'Usage

### Prototypage Rapide
- **Tiny (5×5)** : Tests rapides d'outils, visualisation simple

### Petites Maps de Jeu
- **Small (10×10)** : Niveaux tutoriels, mini-puzzles

### Maps Standards
- **Medium (20×20)** : Équilibre taille/performance, bon pour la plupart des cas

### Grandes Cartes
- **Large (30×30)** : Mondes ouverts, exploration

### Maps Massives
- **Huge (50×50)** : Campagnes longues, MMO (attention performance)

### Dimensions Personnalisées
- **Rectangulaires (40×20)** : Niveaux couloir, cartes de défilement
- **Carrées spéciales (15×15)** : Besoins spécifiques

## ⚡ Performance

### Recommandations
- **≤400 cases** : Performance excellente
- **400-1000 cases** : Performance bonne
- **1000-2500 cases** : Performance acceptable (warning affiché)
- **>2500 cases** : Bloqué par validation

### Optimisations SVG
- Au-delà de 500-600 cases, considérer :
  - Désactiver la grille
  - Réduire la taille des hexagones
  - Utiliser Canvas au lieu de SVG (future feature)

## 🔮 Extensions Futures

- [ ] Clear map (réinitialiser sans changer taille)
- [ ] Resize avec preservation du contenu (crop/expand)
- [ ] Templates prédéfinis (île, montagne, désert, etc.)
- [ ] Import de dimensions depuis JSON
- [ ] Preview de la taille avant création

## ✅ Validation

- ✅ Modal s'ouvre/ferme correctement
- ✅ Presets fonctionnels
- ✅ Inputs personnalisés valident les valeurs
- ✅ Pattern de test génère correctement
- ✅ Carte vide fonctionne
- ✅ Validation des dimensions
- ✅ Messages d'erreur affichés
- ✅ Warning pour grandes cartes
- ✅ Aucune erreur TypeScript
- ✅ Styles cohérents avec le thème

---

**Feature Status** : ✅ COMPLETE & TESTED

