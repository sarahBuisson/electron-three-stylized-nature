# HexagonalInstances - Component Documentation

## 📋 Description

Un composant React Three Fiber qui affiche un système de particules disposées en grille hexagonale avec animation sinusoïdale verticale.

## 🎨 Caractéristiques

- **Grille Hexagonale** : Disposition des particules en pattern hexagonal flat-topped
- **Animation Sinusoïdale** : Mouvement vertical fluide suivant une onde sinusoïdale
- **Hautement Configurable** : 8 propriétés pour personnaliser l'apparence et l'animation
- **Performance Optimisée** : Utilise THREE.Points pour des milliers de particules
- **Texture Procédurale** : Gradient radial généré dynamiquement

## 📦 Props

### Dimensions
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `width` | number | 10 | Nombre de particules en largeur |
| `height` | number | 10 | Nombre de particules en hauteur |
| `hexSize` | number | 1 | Espacement entre les hexagones |

### Apparence
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `InstanceSize` | number | 0.2 | Taille de chaque particule |
| `InstanceColor` | string | '#00ff88' | Couleur des particules (hex) |

### Animation
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `waveSpeed` | number | 1 | Vitesse de l'animation (multiplier temps) |
| `waveAmplitude` | number | 0.5 | Amplitude verticale de l'onde |
| `waveFrequency` | number | 0.5 | Fréquence du pattern d'onde |

## 🚀 Utilisation

### Exemple Basic

```tsx
import { Canvas } from '@react-three/fiber';
import { HexagonalInstances } from '@components/Instances/HexagonalInstances';

function Scene() {
  return (
    <Canvas camera={{ position: [0, 15, 15] }}>
      <HexagonalInstances
        width={10}
        height={10}
        InstanceColor="#00ff88"
      />
    </Canvas>
  );
}
```

### Exemple avec Configuration Complète

```tsx
<HexagonalInstances
  width={20}
  height={20}
  hexSize={0.8}
  InstanceSize={0.3}
  InstanceColor="#4a90e2"
  waveSpeed={1.5}
  waveAmplitude={1}
  waveFrequency={0.8}
/>
```

### Petite Grille Rapide

```tsx
<HexagonalInstances
  width={5}
  height={5}
  hexSize={1.5}
  waveSpeed={3}
  waveAmplitude={1.5}
  InstanceColor="#ffd700"
/>
```

### Grande Grille Dense

```tsx
<HexagonalInstances
  width={25}
  height={25}
  hexSize={0.5}
  InstanceSize={0.15}
  waveSpeed={0.5}
  waveAmplitude={0.3}
  InstanceColor="#9b59b6"
/>
```

## 🎭 Presets Storybook

### Default
- Grille 10×10 standard
- Animation fluide
- Couleur cyan (#00ff88)

### SmallGrid
- 5×5 avec grands hexagones
- Animation rapide
- Couleur rose (#ff6b9d)

### LargeGrid
- 20×20 dense
- Animation lente et subtile
- Couleur bleue (#4a90e2)

### FastWave
- Animation rapide (speed: 3)
- Grande amplitude (1.5)
- Couleur dorée (#ffd700)

### SlowWave
- Animation très lente (speed: 0.3)
- Mouvement contemplatif
- Couleur violette (#9b59b6)

### HighFrequency
- Pattern d'onde serré
- Fréquence élevée (1.5)
- Couleur rouge (#e74c3c)

### Dense
- 25×25 particules
- Très dense et rapproché
- Couleur turquoise (#1abc9c)

## 🔧 Architecture Technique

### Système Hexagonal

Le composant utilise un système de coordonnées axiales pour les hexagones flat-topped :

```typescript
function hexToPosition(q: number, r: number, size: number) {
  const x = size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
  const y = size * (3 / 2) * r;
  return [x, y];
}
```

### Animation Sinusoïdale

Chaque particule a une phase unique calculée selon sa position :

```typescript
const phase = (q / width + r / height) * Math.PI * 2 * waveFrequency;
const y = Math.sin(time * waveSpeed + phase) * waveAmplitude;
```

### Texture Procédurale

Un gradient radial est généré sur un canvas pour donner un effet de "glow" :

```typescript
const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)');
gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
```

## ⚡ Performance

### Optimisations
- **THREE.Points** : Rendu optimisé pour beaucoup de particules
- **BufferGeometry** : Géométrie efficace avec BufferAttributes
- **Texture Réutilisée** : Texture générée une seule fois avec useMemo
- **Position Update** : Seul l'attribut Y est mis à jour chaque frame

### Recommandations
- **≤ 100 particules (10×10)** : Excellent
- **100-400 particules (20×20)** : Très bon
- **400-900 particules (30×30)** : Bon
- **> 900 particules** : Peut ralentir sur GPU faibles

## 🎨 Cas d'Usage

### Backgrounds Animés
```tsx
<HexagonalInstances
  width={20}
  height={15}
  hexSize={0.8}
  InstanceSize={0.15}
  InstanceColor="#1a1a2e"
  waveSpeed={0.5}
  waveAmplitude={0.3}
/>
```

### Effet de Champ d'Énergie
```tsx
<HexagonalInstances
  width={10}
  height={10}
  hexSize={1}
  InstanceSize={0.4}
  InstanceColor="#00ffff"
  waveSpeed={2}
  waveAmplitude={1.5}
  waveFrequency={1}
/>
```

### Visualisation de Données
```tsx
<HexagonalInstances
  width={15}
  height={15}
  hexSize={0.7}
  InstanceSize={0.25}
  InstanceColor="#4a90e2"
  waveSpeed={1}
  waveAmplitude={0.5}
/>
```

## 🎓 Concepts Mathématiques

### Pattern Hexagonal
Les hexagones utilisent un système de coordonnées axiales (q, r) qui permet un pavage efficace du plan.

### Onde Sinusoïdale
La position verticale suit la formule :
```
y(t) = A × sin(ωt + φ)
```
Où :
- A = waveAmplitude (amplitude)
- ω = waveSpeed (pulsation)
- φ = phase (déphasage basé sur position)

### Phase Distribution
Le déphasage crée l'effet d'onde qui traverse la grille :
```
φ = (q/W + r/H) × 2π × frequency
```

## 🔮 Extensions Futures

- [ ] Support pour hexagones pointy-topped
- [ ] Patterns d'animation personnalisés (pas seulement sinusoïde)
- [ ] Couleurs individuelles par particule
- [ ] Interaction avec la souris
- [ ] Connexions entre particules voisines
- [ ] Support pour WebGL instancing
- [ ] Instances avec formes custom (au lieu de cercles)

## 📝 Exemples Avancés

### Avec OrbitControls

```tsx
import { OrbitControls } from '@react-three/drei';

<Canvas camera={{ position: [0, 20, 20] }}>
  <HexagonalInstances
    width={15}
    height={15}
    InstanceColor="#00ff88"
  />
  <OrbitControls />
  <gridHelper args={[50, 50]} />
</Canvas>
```

### Multiple Layers

```tsx
<>
  <HexagonalInstances
    width={10}
    height={10}
    InstanceColor="#00ff88"
    waveSpeed={1}
  />
  <HexagonalInstances
    width={10}
    height={10}
    hexSize={0.5}
    InstanceColor="#ff00ff"
    waveSpeed={1.5}
    waveAmplitude={0.3}
  />
</>
```

## 🐛 Troubleshooting

### Particules ne sont pas visibles
- Vérifiez la position de la caméra
- Ajustez `InstanceSize`
- Vérifiez que le Canvas a un background ou une couleur contrastante

### Animation saccadée
- Réduisez le nombre de particules (width × height)
- Vérifiez les performances GPU

### Pas d'effet d'onde
- Augmentez `waveAmplitude`
- Ajustez `waveFrequency`
- Vérifiez que `waveSpeed > 0`

---

**Component Status** : ✅ Production Ready  
**Performance** : Optimisé pour 500+ particules  
**Browser Support** : Tous navigateurs modernes avec WebGL

