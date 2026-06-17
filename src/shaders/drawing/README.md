# DrawingMaterial

A cross-hatching GLSL shader material for React Three Fiber that creates a stylized pen-and-ink drawing effect.

## Overview

This shader material is based on the Microsoft Research paper ["Real-Time Hatching"](http://research.microsoft.com/en-us/um/people/hoppe/hatching.pdf) and implements:

- **Blinn-Phong shading** for realistic light interaction
- **Rim lighting** for enhanced edge definition
- **Cross-hatching layers** that respond to light intensity
- **Paper texture overlay** for authentic drawing appearance
- **Outline rendering** option for comic book style

## Installation

The component requires:
- `@react-three/fiber`
- `@react-three/drei`
- `three`

## Usage

### Basic Example

```tsx
import { DrawingMaterial } from './shaders/drawing/DrawingMaterial';

function MyComponent() {
  return (
    <mesh>
      <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      <DrawingMaterial
        ambientWeight={0.08}
        diffuseWeight={1.0}
        rimWeight={0.46}
        inkColor={[72, 72, 164]}
      />
    </mesh>
  );
}
```

### With Textures

For the best effect, provide hatching and paper textures:

```tsx
import { useTexture } from '@react-three/drei';

function MyComponent() {
  const hatchTextures = [
    useTexture('/textures/hatch_0.jpg'),
    useTexture('/textures/hatch_1.jpg'),
    useTexture('/textures/hatch_2.jpg'),
    useTexture('/textures/hatch_3.jpg'),
    useTexture('/textures/hatch_4.jpg'),
    useTexture('/textures/hatch_5.jpg'),
  ];
  
  const paperTexture = useTexture('/textures/paper.jpg');

  return (
    <mesh>
      <sphereGeometry args={[1, 32, 32]} />
      <DrawingMaterial
        hatchTextures={hatchTextures}
        paperTexture={paperTexture}
        repeat={[4, 4]}
      />
    </mesh>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ambientWeight` | `number` | `0.08` | Weight of ambient lighting (0-1) |
| `diffuseWeight` | `number` | `1.0` | Weight of diffuse lighting (0-1) |
| `rimWeight` | `number` | `0.46` | Weight of rim lighting effect (0-1) |
| `specularWeight` | `number` | `1.0` | Weight of specular highlights (0-1) |
| `shininess` | `number` | `49.0` | Specular shininess factor (1-100) |
| `invertRim` | `boolean` | `false` | Invert rim lighting direction |
| `displayOutline` | `boolean` | `false` | Enable outline rendering |
| `solidRender` | `boolean` | `false` | Render as solid shading without hatching |
| `inkColor` | `[number, number, number]` | `[72, 72, 164]` | RGB ink color (0-255) |
| `lightPosition` | `[number, number, number]` | `[-100, 100, 0]` | Position of the light source |
| `repeat` | `[number, number]` | `[1, 1]` | UV repeat for hatching textures |
| `hatchTextures` | `THREE.Texture[]` | `undefined` | Array of 6 hatching textures (darkest to lightest) |
| `paperTexture` | `THREE.Texture` | `undefined` | Paper texture for background |

## Presets

### Default
Clean technical drawing style with blue ink:
```tsx
<DrawingMaterial
  ambientWeight={0.08}
  diffuseWeight={1.0}
  specularWeight={1.0}
  rimWeight={0.46}
  shininess={49}
  inkColor={[72, 72, 164]}
/>
```

### Sketch
Soft, artistic sketch style:
```tsx
<DrawingMaterial
  ambientWeight={0.098}
  diffuseWeight={1.0}
  specularWeight={1.0}
  rimWeight={0.81}
  shininess={12}
  invertRim={true}
  inkColor={[175, 175, 175]}
/>
```

### Classroom
Bold outline style for educational content:
```tsx
<DrawingMaterial
  ambientWeight={0.13}
  diffuseWeight={0.27}
  specularWeight={1.0}
  rimWeight={0.76}
  shininess={27}
  displayOutline={true}
  inkColor={[41, 41, 202]}
/>
```

### Engraving
Dark, detailed engraving style:
```tsx
<DrawingMaterial
  ambientWeight={0}
  diffuseWeight={0.57}
  specularWeight={1.0}
  rimWeight={0.77}
  shininess={15}
  invertRim={true}
  inkColor={[90, 120, 111]}
/>
```

## Hatching Textures

The shader expects 6 hatching textures that represent different levels of shading from darkest (hatch6) to lightest (hatch1). These textures should:

- Be seamlessly tileable
- Be grayscale or monochrome
- Progress from dense cross-hatching (dark) to sparse lines (light)
- Use the same dimensions for consistent tiling

## Technical Details

### Shading Model

The shader uses a custom shading calculation that combines:

1. **Ambient**: Base lighting level
2. **Diffuse**: Lambertian diffuse lighting (N·L)
3. **Specular**: Blinn-Phong specular highlights
4. **Rim**: Fresnel-like rim lighting effect

The combined shading value determines which hatching layer to use.

### Hatching Layers

Shading is divided into 6 ranges, each blending between two adjacent hatching textures:
- 0.00 - 0.17: hatch6 → hatch5
- 0.17 - 0.33: hatch5 → hatch4
- 0.33 - 0.50: hatch4 → hatch3
- 0.50 - 0.67: hatch3 → hatch2
- 0.67 - 0.83: hatch2 → hatch1
- 0.83 - 1.00: hatch1 → white

### Paper Texture

The paper texture is applied using screen-space coordinates, creating a consistent background texture that doesn't move with the geometry.

## Credits

Based on the work by Jaume Sanchez ([@thespite](https://twitter.com/thespite)) implementing the Microsoft Research "Real-Time Hatching" paper.

## License

Original shader by Jaume Sanchez. React Three Fiber adaptation for this project.

