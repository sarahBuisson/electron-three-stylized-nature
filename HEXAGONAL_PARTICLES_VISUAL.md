# 🎨 HexagonalWave - Explication Visuelle

## 📐 Pavage Hexagonal

### Structure de la Grille

```
     width = 5, height = 3
     
     ⬡   ⬡   ⬡   ⬡   ⬡
       ⬡   ⬡   ⬡   ⬡   ⬡
     ⬡   ⬡   ⬡   ⬡   ⬡
     
     (0,0) (1,0) (2,0) (3,0) (4,0)
       (0,1) (1,1) (2,1) (3,1) (4,1)
     (0,2) (1,2) (2,2) (3,2) (4,2)
```

Chaque hexagone a 6 voisins disposés en cercle autour de lui.

### Coordonnées Axiales

Le système utilise des coordonnées (q, r) où :
- **q** = index horizontal (0 à width-1)
- **r** = index vertical (0 à height-1)

### Conversion en Position 3D

```
Position X = hexSize × (√3 × q + (√3/2) × r)
Position Z = hexSize × (3/2) × r)
Position Y = animation sinusoïdale
```

## 🌊 Animation Sinusoïdale

### Vue de Côté (temps t)

```
Temps t=0:
   ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
━━━━━━━━━━━━━━━━━━━━━━━ (niveau 0)

Temps t=1:
     ⬡     ⬡     ⬡
   ⬡   ⬡ ⬡   ⬡ ⬡   ⬡
━━━━━━━━━━━━━━━━━━━━━━━ (niveau 0)

Temps t=2:
   ⬡     ⬡     ⬡     
     ⬡ ⬡   ⬡ ⬡   ⬡ ⬡
━━━━━━━━━━━━━━━━━━━━━━━ (niveau 0)
```

Chaque particule oscille verticalement : `y = sin(time + phase) × amplitude`

### Phase de Chaque Particule

```
Phase = (q/width + r/height) × 2π × frequency

Exemple avec frequency=1, width=4, height=4:

Position (0,0): phase = 0
Position (1,0): phase = π/2
Position (2,0): phase = π
Position (3,0): phase = 3π/2
Position (0,1): phase = π/2
Position (1,1): phase = π
... etc
```

L'effet crée une "vague" diagonale qui traverse la grille.

## 🎬 Effet Visuel

### Vue de Dessus avec Amplitude

```
Onde qui traverse (temps progressif) :

t=0:    t=1:    t=2:    t=3:
⬡⬡⬡⬡   ⬢⬡⬡⬡   ⬡⬢⬡⬡   ⬡⬡⬢⬡
⬡⬡⬡⬡   ⬡⬢⬡⬡   ⬡⬡⬢⬡   ⬡⬡⬡⬢
⬡⬡⬡⬡   ⬡⬡⬢⬡   ⬡⬡⬡⬢   ⬢⬡⬡⬡
⬡⬡⬡⬡   ⬡⬡⬡⬢   ⬢⬡⬡⬡   ⬡⬢⬡⬡

Légende:
⬡ = particule au niveau 0
⬢ = particule au maximum d'amplitude (haut)
```

## 🎛️ Effet des Props

### waveSpeed

```
waveSpeed = 0.5     waveSpeed = 2
(Lent)              (Rapide)

⬡ ⬡ ⬡ ⬡            ⬡ ⬡ ⬡ ⬡
  ⬢   ⬢              ⬢ ⬢ ⬢ ⬢
⬡ ⬡ ⬡ ⬡            ⬡ ⬡ ⬡ ⬡

Onde traverse        Onde traverse
en 2 secondes       en 0.5 secondes
```

### waveAmplitude

```
amplitude = 0.3     amplitude = 1.5
(Petit)             (Grand)

  ⬢                    ⬢
━⬡━━━               ━━━━━
  ⬡                    ⬡
                       ⬡
```

### waveFrequency

```
frequency = 0.3      frequency = 1.5
(Espacé)             (Serré)

⬢   ⬡   ⬢   ⬡      ⬢ ⬡ ⬢ ⬡ ⬢ ⬡ ⬢
                     ⬡ ⬢ ⬡ ⬢ ⬡ ⬢ ⬡

Une crête tous       Plusieurs crêtes
les 3 hexagones     par ligne
```

## 📊 Structure de Données

### BufferGeometry

```typescript
positions: Float32Array
[
  x₀, y₀, z₀,  // Particule 0
  x₁, y₁, z₁,  // Particule 1
  x₂, y₂, z₂,  // Particule 2
  ...
]

phases: number[]
[
  φ₀,  // Phase particule 0
  φ₁,  // Phase particule 1
  φ₂,  // Phase particule 2
  ...
]
```

### Update Loop (useFrame)

```
Pour chaque frame:
  temps = clock.elapsedTime × waveSpeed
  
  Pour chaque particule i:
    y[i] = sin(temps + phase[i]) × amplitude
    
  Marquer positions comme modifiées
```

## 🎨 Exemple Visuel Complet

### Configuration
```tsx
<HexagonalWave
  width={8}
  height={6}
  hexSize={1}
  waveSpeed={1}
  waveAmplitude={0.5}
  waveFrequency={0.5}
/>
```

### Résultat (vue 3D)

```
         Vue de Dessus              Vue de Côté
    
    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡             ⬢   ⬡   ⬢
  ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡           ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡       ━━━━━━━━━━━━━━━━━
  ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡           ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
    ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡             ⬢   ⬡   ⬢
  ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡
```

Animation : Les particules montent et descendent de façon synchronisée mais déphasée, créant une onde fluide.

## 🔬 Formule Mathématique Complète

### Position Finale de Chaque Particule

```
Pour particule à coordonnées (q, r):

x = hexSize × (√3 × q + (√3/2) × r)

y = waveAmplitude × sin(
      waveSpeed × time 
      + (q/width + r/height) × 2π × waveFrequency
    )

z = hexSize × (3/2) × r

couleur = particleColor
taille = particleSize
```

## 🎯 Cas d'Usage Visuels

### Background Calme
```
Paramètres:
- width/height: 20×15 (dense)
- hexSize: 0.8 (rapproché)
- waveSpeed: 0.5 (lent)
- waveAmplitude: 0.3 (subtil)

Effet: Fond animé discret, non intrusif
```

### Effet Énergétique
```
Paramètres:
- width/height: 10×10 (moyen)
- hexSize: 1 (normal)
- waveSpeed: 2 (rapide)
- waveAmplitude: 1.5 (prononcé)

Effet: Énergie, dynamisme, attention
```

### Champ Visuel
```
Paramètres:
- width/height: 15×15 (dense)
- hexSize: 0.7 (serré)
- waveSpeed: 1 (normal)
- waveFrequency: 1 (onde serrée)

Effet: Champ de force, sci-fi, futuriste
```

## 🎨 Inspirations Visuelles

```
┌─────────────────────────────────────┐
│  Océan avec Vagues                  │
│    ≈≈≈≈ ～～～ ≈≈≈≈ ～～～         │
│  ～～～ ≈≈≈≈ ～～～ ≈≈≈≈          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Champ Magnétique                   │
│    ⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡            │
│  ⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡ ⚡           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Écran Holographique                │
│    ◆ ◇ ◆ ◇ ◆ ◇ ◆ ◇             │
│  ◇ ◆ ◇ ◆ ◇ ◆ ◇ ◆ ◇            │
└─────────────────────────────────────┘
```

---

**Comprendre visuellement comment fonctionne HexagonalWave !** 🎨✨

