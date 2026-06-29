#  Quick Start - HexagonalParticles

## ✨ Composant Créé

**HexagonalParticles** - Système de particules en grille hexagonale avec animation sinusoïdale verticale.

##  Utilisation en 3 Lignes

```tsx
import { HexagonalParticles } from '@components/particles/HexagonalParticles';

<Canvas>
  <HexagonalParticles width={10} height={10} particleColor="#00ff88" />
</Canvas>
```

##  Ce qui a été créé

1. **HexagonalParticles.tsx** - Component principal
2. **HexagonalParticles.stories.tsx** - 7 stories Storybook
3. **HexagonalParticles.example.tsx** - 4 exemples prêts
4. **README.md** - Documentation complète
5. **HEXAGONAL_PARTICLES_SUMMARY.md** - Récapitulatif

##  Tester Maintenant

### Option 1 : Storybook
```bash
npm run storybook
```
Puis : **Particles → HexagonalParticles**

### Option 2 : Intégration Rapide
```tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HexagonalParticles } from '@components/particles/HexagonalParticles';

export default function MyScene() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 15, 15] }}>
        <HexagonalParticles
          width={15}
          height={15}
          particleColor="#00ff88"
          waveSpeed={1}
          waveAmplitude={0.5}
        />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
```

##  Props Principales

| Prop | Valeur | Description |
|------|--------|-------------|
| `width` | `10` | Nombre de particules en largeur |
| `height` | `10` | Nombre de particules en hauteur |
| `particleColor` | `"#00ff88"` | Couleur des particules |
| `waveSpeed` | `1` | Vitesse de l'animation |
| `waveAmplitude` | `0.5` | Hauteur de l'oscillation |

##  Presets Rapides

### Effet Calme
```tsx
<HexagonalParticles
  width={10}
  height={10}
  waveSpeed={0.5}
  waveAmplitude={0.3}
  particleColor="#4a90e2"
/>
```

### Effet Énergétique
```tsx
<HexagonalParticles
  width={15}
  height={15}
  waveSpeed={2}
  waveAmplitude={1.5}
  particleColor="#00ffff"
/>
```

### Background Dense
```tsx
<HexagonalParticles
  width={25}
  height={25}
  hexSize={0.5}
  particleSize={0.1}
  particleColor="#1a1a2e"
/>
```

##  Ce que ça fait

1. **Grille Hexagonale** : Les particules sont disposées en pattern hexagonal parfait
2. **Animation Sinusoïdale** : Elles bougent verticalement comme une vague
3. **Effet Hypnotique** : Le déphasage crée une onde qui traverse la grille

##  Performance

- **5×5 (25 particules)** : ⚡ Parfait
- **10×10 (100 particules)** : ⚡ Excellent
- **20×20 (400 particules)** : ✅ Très bon
- **30×30 (900 particules)** : ⚠️ Bon

##  Cas d'Usage

✅ Background animé  
✅ Effet de champ d'énergie  
✅ Visualisation de données  
✅ Interface futuriste  
✅ Loading screen  
✅ Art génératif

##  Personnalisation

### Changer la Couleur
```tsx
particleColor="#ff00ff"  // Magenta
particleColor="#ffd700"  // Or
particleColor="#00ffff"  // Cyan
```

### Ajuster l'Animation
```tsx
waveSpeed={0.3}    // Lent et contemplatif
waveSpeed={1}      // Normal
waveSpeed={3}      // Rapide et énergétique
```

### Modifier la Densité
```tsx
// Sparse
width={5} height={5} hexSize={2}

// Dense
width={25} height={25} hexSize={0.5}
```

##  Documentation

Pour plus de détails, consultez :
- **README.md** - Guide complet avec tous les exemples
- **HEXAGONAL_PARTICLES_SUMMARY.md** - Récapitulatif technique
- **Storybook** - Tests interactifs en temps réel

##  Ready to Use!

Le composant est **production-ready** avec :
- ✅ 0 erreur TypeScript
- ✅ Performance optimisée
- ✅ Documentation complète
- ✅ Exemples multiples
- ✅ Storybook stories

**Amusez-vous bien avec vos particules hexagonales !** 

---

**Questions ?** Consultez README.md ou testez dans Storybook !
