# 🗺️ Éditeur de Carte Hexagonale - Guide Rapide

## ✨ Ce qui a été créé

Un éditeur de carte hexagonale complet avec outils de peinture de type "Photoshop" pour éditer des grilles hexagonales.

## 📂 Nouveaux Fichiers

```
src/
├── components/
│   └── map/
│       ├── HexagonMap.tsx           ✅ Composant d'affichage SVG
│       ├── HexagonMap.stories.tsx   ✅ 7 stories Storybook
│       └── README.md                ✅ Documentation technique
├── pages/
│   ├── MapEditorPage.tsx            ✅ Page principale de l'éditeur
│   └── MapEditorPage.css            ✅ Styles thème sombre
└── utils/
    ├── floodFill.ts                 ✅ Algorithme flood fill
    └── mapSerializer.ts             ✅ Export/Import JSON (future)

docs/
├── GUIDE_EDITEUR_CARTE.md           ✅ Guide utilisateur complet
├── EXPORT_IMPORT_GUIDE.md           ✅ Guide développeur export/import
└── MAP_EDITOR_SUMMARY.md            ✅ Documentation technique complète
```

## 🎮 Comment Utiliser

### 1. Lancer l'Application
```bash
npm run dev
```

### 2. Accéder à l'Éditeur
1. Menu Principal
2. Cliquer sur **"Editeur de Carte"**
3. L'éditeur s'ouvre avec une carte pré-générée

### 3. Éditer la Carte

#### Mode Pinceau 🖌️
```
1. Cliquez sur "Brush"
2. Choisissez un type de terrain (ex: Water)
3. Cliquez sur une case → elle devient bleue
4. Glissez pour peindre plusieurs cases
```

#### Mode Seau 🪣
```
1. Cliquez sur "Bucket"
2. Choisissez un type de terrain (ex: Grass)
3. Cliquez sur une zone → toute la zone connectée change
```

## 🎨 Types de Terrain Disponibles

| Icône | Type | Couleur | Usage |
|-------|------|---------|-------|
| 🏜️ | Zone | Beige | Terrain par défaut |
| 💧 | Water | Bleu | Eau, lacs |
| ⛰️ | Mountain | Marron | Montagnes |
| 🌲 | Tree | Vert foncé | Forêts |
| 🪨 | Rock | Gris | Rochers |
| 🏖️ | Sand | Beige clair | Plages |
| 🌿 | Grass | Vert | Prairies |
| 💜 | Purple | Violet | Marqueurs |

## 🛠️ Interface Utilisateur

```
┌─────────────────────────────────────────────────┐
│  Hexagonal Map Editor          ← Back to Menu   │
├──────────┬──────────────────────────────────────┤
│          │  Tool: 🖌️ Brush  Terrain: water      │
│  TOOLS   ├──────────────────────────────────────┤
│ 🖌️ Brush │                                      │
│ 🪣 Bucket│         CARTE HEXAGONALE             │
│          │                                      │
│ TERRAIN  │    [Hexagones interactifs]           │
│ Zone     │                                      │
│ Water    │         (scrollable)                 │
│ Mountain │                                      │
│ Tree     │                                      │
│ ...      │                                      │
│          │                                      │
│ OPTIONS  │                                      │
│ ☑ Grid   │                                      │
│          │                                      │
│ STATS    │                                      │
│ water: 15│                                      │
│ tree: 8  │                                      │
│ ...      │                                      │
└──────────┴──────────────────────────────────────┘
```

## 🎯 Cas d'Usage Typiques

### Créer un Lac
```
1. Outil: Bucket 🪣
2. Terrain: Water 💧
3. Clic au centre → lac créé instantanément
```

### Dessiner une Forêt
```
1. Outil: Brush 🖌️
2. Terrain: Tree 🌲
3. Clic-glissé → forme de forêt
```

### Tracer une Montagne
```
1. Outil: Brush 🖌️
2. Terrain: Mountain ⛰️
3. Paint le long d'une ligne
```

## 🚀 Features Principales

✅ **Brush Tool** - Peinture précise case par case
✅ **Bucket Tool** - Remplissage rapide de zones
✅ **8 Types de Terrain** - Palette complète
✅ **Grille Toggle** - Afficher/masquer coordonnées
✅ **Statistiques Live** - Compteur en temps réel
✅ **Hover Feedback** - Aperçu avant peinture
✅ **Sélection de Case** - Infos détaillées
✅ **Scrolling** - Navigation fluide
✅ **Thème Sombre** - Interface confortable

## 📖 Documentation

| Document | Description |
|----------|-------------|
| `GUIDE_EDITEUR_CARTE.md` | Guide utilisateur détaillé |
| `MAP_EDITOR_SUMMARY.md` | Documentation technique |
| `EXPORT_IMPORT_GUIDE.md` | Guide export/import (future feature) |
| `src/components/map/README.md` | Doc développeur du composant |

## 🧪 Tester dans Storybook

```bash
npm run storybook
```

Puis naviguer vers : **Map → HexagonMap**

Stories disponibles :
- SmallMap (5×5)
- MediumMap (10×10)
- LargeRandomMap (aléatoire)
- NoGrid (sans grille)
- Interactive (avec logs)
- SmallHexagons / LargeHexagons

## 🔮 Prochaines Features (Optionnelles)

- [ ] Export/Import JSON (code déjà prêt dans `mapSerializer.ts`)
- [ ] Undo/Redo
- [ ] Auto-save
- [ ] Eyedropper tool (pipette)
- [ ] Selection tools
- [ ] Procedural generation

## ✅ Validation

Tous les tests passent :

✅ Compilation TypeScript sans erreur
✅ Brush tool fonctionne
✅ Bucket tool fonctionne
✅ Statistiques mises à jour
✅ Navigation retour menu
✅ Stories Storybook opérationnelles
✅ Documentation complète

## 🎉 Résultat

**Éditeur de carte hexagonale professionnel et prêt à l'emploi !**

Pour commencer :
```bash
npm run dev
```
Puis : Menu → "Editeur de Carte" → Enjoy! 🎨

---

**Questions ?** Consultez :
- `GUIDE_EDITEUR_CARTE.md` - Guide utilisateur
- `MAP_EDITOR_SUMMARY.md` - Doc technique complète
- `src/components/map/README.md` - API du composant

