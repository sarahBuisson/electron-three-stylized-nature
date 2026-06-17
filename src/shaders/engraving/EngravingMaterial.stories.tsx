import type { Meta, StoryObj } from '@storybook/react-vite';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { EngravingMaterial, type EngravingMaterialProps } from './EngravingMaterial';

/**
 * # EngravingMaterial
 *
 * A cross-hatching GLSL shader material that creates a stylized pen-and-ink engraving effect.
 * Based on the Microsoft Research "Real-Time Hatching" paper.
 *
 * ## Features
 * - Blinn-Phong shading with rim lighting
 * - Cross-hatching layers based on light intensity
 * - Paper texture overlay support
 * - Multiple artistic presets
 */
const meta = {
  title: 'Graphics/Materials/EngravingMaterial',
  component: EngravingMaterial,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'A stylized shader material for creating pen-and-ink engraving effects with cross-hatching.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    ambientWeight: {
      control: { type: 'range', min: 0, max: 1, step: 0.01 },
      description: 'Weight of ambient lighting',
    }
  },
} satisfies Meta<typeof EngravingMaterial>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper component for stories
const EngravingMaterialScene = (args: EngravingMaterialProps) => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <OrbitControls enableDamping />
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <EngravingMaterial {...args} />
        </mesh>
      </Canvas>
    </div>
  );
};

/**
 * Default preset with clean technical engraving style and blue ink.
 */
export const Default: Story = {
  args: {
    ambientWeight: 0.08,
    diffuseWeight: 1.0,
    rimWeight: 0.46,
    specularWeight: 1.0,
    shininess: 49,
    invertRim: false,
    displayOutline: false,
    solidRender: false,
    inkColor: [72, 72, 164],
    repeat: [20, 2],
  },
  render: (args) => <EngravingMaterialScene {...args} />,
};

/**
 * Sketch preset with soft, artistic style using gray tones.
 */
export const Sketch: Story = {
  args: {
    ambientWeight: 0.098,
    diffuseWeight: 1.0,
    rimWeight: 0.81,
    specularWeight: 1.0,
    shininess: 12,
    invertRim: true,
    displayOutline: false,
    solidRender: false,
    inkColor: [175, 175, 175],
    repeat: [20, 2],
  },
  render: (args) => <EngravingMaterialScene {...args} />,
};

/**
 * Classroom preset with bold outlines, ideal for educational content.
 */
export const Classroom: Story = {
  args: {
    ambientWeight: 0.13,
    diffuseWeight: 0.27,
    rimWeight: 0.76,
    specularWeight: 1.0,
    shininess: 27,
    invertRim: false,
    displayOutline: true,
    solidRender: false,
    inkColor: [41, 41, 202],
    repeat: [20, 2],
  },
  render: (args) => <EngravingMaterialScene {...args} />,
};

/**
 * Engraving preset with dark, detailed style.
 */
export const Engraving: Story = {
  args: {
    ambientWeight: 0,
    diffuseWeight: 0.57,
    rimWeight: 0.77,
    specularWeight: 1.0,
    shininess: 15,
    invertRim: true,
    displayOutline: false,
    solidRender: false,
    inkColor: [90, 120, 111],
    repeat: [20, 2],
  },
  render: (args) => <EngravingMaterialScene {...args} />,
};

/**
 * Solid render mode without hatching textures.
 */
export const SolidRender: Story = {
  args: {
    ambientWeight: 0.08,
    diffuseWeight: 1.0,
    rimWeight: 0.46,
    specularWeight: 1.0,
    shininess: 49,
    invertRim: false,
    displayOutline: false,
    solidRender: true,
    inkColor: [72, 72, 164],
    repeat: [20, 2],
  },
  render: (args) => <EngravingMaterialScene {...args} />,
};

/**
 * Multiple geometries with different settings.
 */
export const MultipleObjects: Story = {
  render: () => (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <OrbitControls enableDamping />

        {/* TorusKnot with Default preset */}
        <mesh position={[0, 0, 0]}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <EngravingMaterial
            ambientWeight={0.808}
            diffuseWeight={1.0}
            rimWeight={10.46}
            inkColor={[72, 72, 164]}
            repeat={[2, 1]}
          />
        </mesh>

        {/* Sphere with Sketch preset */}
        <mesh position={[3, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <EngravingMaterial
            ambientWeight={0.098}
            diffuseWeight={1.0}
            rimWeight={0.81}
            shininess={12}
            invertRim={true}
            inkColor={[175, 175, 175]}
            repeat={[4, 4]}
          />
        </mesh>

        {/* Box with Classroom preset */}
        <mesh position={[-3, 0, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <EngravingMaterial
            ambientWeight={0.13}
            diffuseWeight={0.27}
            rimWeight={0.76}
            shininess={27}
            displayOutline={true}
            inkColor={[41, 41, 202]}
            repeat={[1, 1]}
          />
        </mesh>
      </Canvas>
    </div>
  ),
};



