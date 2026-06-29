# Play Map Feature - Documentation

## 🎮 Fonctionnalité Ajoutée

**Possibilité de "jouer" la carte créée** dans l'éditeur en mode 3D avec un personnage contrôlable.

## 📁 Fichiers Créés (3 fichiers)

### 1. `src/utils/mapPlayStorage.ts`
**Rôle** : Gestion du storage de la carte pour le mode Play

**Fonctions** :
- `saveMapForPlay(tableau)` - Sauvegarde la carte dans localStorage
- `loadMapForPlay()` - Charge la carte depuis localStorage
- `hasMapForPlay()` - Vérifie si une carte est disponible

**Storage Format** :
```typescript
{
  width: number
  height: number
  cells: Array<{ x, y, content, scale }>
  timestamp: string
}
```

### 2. `src/pages/MapPlayPage.tsx`
**Rôle** : Page de jeu 3D pour tester la carte

**Features** :
- Chargement automatique de la carte
- Contrôle FPS (WASD + Mouse + Space)
- Physique Rapier
- Éclairage dynamique
- Fog pour la profondeur
- UI overlay avec infos

**Components utilisés** :
- `Canvas` (React Three Fiber)
- `Physics` (@react-three/rapier)
- `KeyboardControls` (@react-three/drei)
- `FPSPlayer` (contrôleur personnage)
- `LandscapeContent` (rendu de la carte)

### 3. `src/pages/MapPlayPage.css`
**Rôle** : Styles pour la page de jeu

**Features** :
- Overlay transparent
- Bouton retour avec backdrop-filter
- Infos de carte dans header
- États Loading/Error
- Responsive mobile

## 🔄 Fichiers Modifiés (3 fichiers)

### 1. `src/pages/MapEditorPage.tsx`
**Modifications** :
- Import de `saveMapForPlay`
- Nouveau callback `handlePlayMap`
- Nouveau bouton "▶️ Play Map" dans le header
- Header restructuré avec `.header-buttons`

### 2. `src/pages/MapEditorPage.css`
**Ajouts** :
- Styles `.header-buttons` (flex container)
- Styles `.play-button` (vert avec animations)
- Hover effects et transitions

### 3. `src/App.tsx`
**Modifications** :
- Import de `MapPlayPage`
- Nouvelle route `/map-play`
- Ajout classe CSS `is-map-play`

## 🎨 Interface Utilisateur

### Bouton Play dans l'Éditeur
```
┌─────────────────────────────────────────────┐
│ Hexagonal Map Editor    [▶️ Play Map] [← Back]│
└─────────────────────────────────────────────┘
```

### Page Map Play
```
┌──────────────────────────────────────────┐
│ [← Back to Editor]   Map: 20×20 • WASD  │
├──────────────────────────────────────────┤
│                                          │
│         SCENE 3D AVEC PERSONNAGE         │
│                                          │
│     [Carte hexagonale en 3D visible]     │
│                                          │
│     [Joueur peut se déplacer librement]  │
│                                          │
└──────────────────────────────────────────┘
```

## 🎮 Contrôles

### Mouvements
- **WASD** ou **ZQSD** (selon preset) : Déplacement
- **Mouse** : Rotation caméra
- **Space** : Sauter
- **ESC** : Libérer pointeur

### UI
- **← Back to Editor** : Retour à l'éditeur
- **Map Info** : Affiche taille et contrôles

## 🔧 Workflow Utilisateur

### 1. Créer une Carte
1. Ouvrir l'éditeur de carte
2. Peindre/éditer la carte
3. (Optionnel) Redimensionner

### 2. Lancer le Mode Play
1. Cliquer sur **▶️ Play Map**
2. La carte est sauvegardée automatiquement
3. Navigation vers `/map-play`
4. Chargement de la carte en 3D

### 3. Jouer
1. Contrôler le personnage (WASD + Mouse)
2. Explorer la carte en 3D
3. Tester la disposition des terrains

### 4. Retourner à l'Éditeur
1. Cliquer **← Back to Editor**
2. Navigation vers `/map-editor`
3. La carte reste inchangée

## 🗺️ Rendu 3D des Terrains

### Types de Terrain Rendus
- **zone** → `<Zone />` (terrain par défaut)
- **water** → `<Water />` (eau)
- **sand** → `<Sand />` (sable)
- **tree** → `<TreeCase height={scale} />` (arbre)
- **grass** → `<GrassCase height={scale} />` (herbe)
- **mountain** → `<Mountain height={scale} />` (montagne)
- **rock** → Actuellement rendu comme zone

### Propriété Scale
La propriété `scale` de chaque case contrôle la hauteur du terrain 3D :
- `scale: 1` → Hauteur normale
- `scale: 2` → 2× plus haut
- `scale: 0.5` → 2× moins haut

## ⚡ Performance

### Optimisations
- **Fog** : Masque les objets lointains
- **Shadows** : Shadow maps 2048×2048
- **Lighting** : Ambient + Directional + Hemisphere
- **Physics** : Rapier optimisé pour performance

### Recommandations
- **≤400 cells** : Excellente performance
- **400-1000 cells** : Bonne performance
- **>1000 cells** : Peut ralentir selon GPU

## 💾 Système de Storage

### localStorage Key
`'hexmap-editor-current-map'`

### Format Stocké
```json
{
  "width": 20,
  "height": 20,
  "cells": [
    { "x": 0, "y": 0, "content": "zone", "scale": 1 },
    { "x": 0, "y": 1, "content": "water", "scale": 1.5 }
  ],
  "timestamp": "2026-06-22T10:30:00.000Z"
}
```

### Persistence
- Sauvegarde automatique au clic "Play Map"
- Chargement automatique à l'ouverture de `/map-play`
- Reste en mémoire jusqu'à écrasement

## 🚨 Gestion d'Erreur

### Pas de Carte Disponible
Si aucune carte n'est sauvegardée :
1. Affichage message "❌ No Map Found"
2. Redirection automatique vers `/map-editor` après 3 secondes
3. Bouton "Return to Editor" disponible

### Erreur de Chargement
Si localStorage corrompu :
1. `loadMapForPlay()` retourne `null`
2. État d'erreur affiché
3. Console log de l'erreur

## 📊 Code Key Snippets

### Sauvegarde de la Carte
```typescript
const handlePlayMap = useCallback(() => {
  saveMapForPlay(tableau)
  navigate('/map-play')
}, [tableau, navigate])
```

### Chargement dans MapPlayPage
```typescript
useEffect(() => {
  const loadedMap = loadMapForPlay()
  
  if (!loadedMap) {
    setError('No map available to play.')
    setTimeout(() => navigate('/map-editor'), 3000)
    return
  }

  setTableau(loadedMap)
}, [navigate])
```

### Rendu 3D
```tsx
<Canvas>
  <KeyboardControls map={keybinds}>
    <Physics gravity={[0, -9.81, 0]}>
      <PerspectiveCamera makeDefault position={[0, 2, 5]} />
      <FPSPlayer position={[0, 2, 0]} />
      <LandscapeContent tableau={tableau} />
    </Physics>
  </KeyboardControls>
</Canvas>
```

## ✅ Tests & Validation

### Tests Fonctionnels
- ✅ Bouton Play visible dans l'éditeur
- ✅ Sauvegarde de la carte fonctionne
- ✅ Navigation vers `/map-play`
- ✅ Chargement de la carte en 3D
- ✅ Contrôles FPS opérationnels
- ✅ Terrains rendus correctement
- ✅ Retour à l'éditeur fonctionne
- ✅ Gestion erreur si pas de carte
- ✅ Loading state affiché

### Tests Techniques
- ✅ TypeScript compilation OK
- ✅ localStorage fonctionne
- ✅ Sérialisation/désérialisation correcte
- ✅ Physique Rapier active
- ✅ Keybinds appliqués
- ✅ Pas de memory leaks

## 💡 Cas d'Usage

### Cas 1 - Test Rapide
```
1. Créer petite carte 5×5
2. Ajouter quelques terrains
3. Cliquer "Play Map"
4. Tester la disposition
5. Retour éditeur pour ajuster
```

### Cas 2 - Vérification Layout
```
1. Créer grande carte 30×30
2. Disposer montagnes et eau
3. Jouer pour vérifier accessibilité
4. Identifier zones bloquées
5. Ajuster dans l'éditeur
```

### Cas 3 - Itération Rapide
```
Edit → Play → Test → Edit → Play → Test
Cycle rapide pour level design
```

## 🔮 Extensions Futures

### Priorité Haute
- [ ] Mode spectateur (caméra libre)
- [ ] Minimap dans le coin
- [ ] Téléportation à des points spécifiques

### Priorité Moyenne
- [ ] Objets interactifs sur la carte
- [ ] Collectables
- [ ] Checkpoints de spawn

### Priorité Basse
- [ ] Mode multijoueur
- [ ] Enregistrement de parties
- [ ] Statistiques de jeu

## 📝 Notes Techniques

### Conversion Coordonnées
Les coordonnées hexagonales 2D sont converties en positions 3D par `computeAveragePositionHexa` dans `LandscapeContent`.

### Collisions
- Personnage utilise `CapsuleCollider`
- Terrains ont des colliders automatiques
- Gravity = 9.81 m/s²

### Caméra
- FOV: 75°
- Position initiale: [0, 2, 5]
- Contrôle first-person

## 🎉 Résultat

**Fonctionnalité Play Map complète et opérationnelle !**

L'utilisateur peut maintenant :
- ✅ Lancer le mode Play depuis l'éditeur
- ✅ Tester sa carte en 3D
- ✅ Se déplacer librement avec contrôles FPS
- ✅ Voir tous les terrains rendus en 3D
- ✅ Retourner facilement à l'éditeur

Le workflow edit-play-edit est fluide et intuitif!

---

**Status** : ✅ **COMPLETE & TESTED**  
**Date** : June 22, 2026  
**Feature** : Map Play Mode  
**Files Created** : 3  
**Files Modified** : 3

