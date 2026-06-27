import type { Meta, StoryObj } from '@storybook/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { HexagonalInstances } from './HexagonalInstances.tsx';

const meta = {
  title: 'Instances/HexagonalInstances',
  component: HexagonalInstances,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 3, max: 30, step: 1 },
      description: 'Number of Instances in width',
    },
    height: {
      control: { type: 'range', min: 3, max: 30, step: 1 },
      description: 'Number of Instances in height',
    },
    hexSize: {
      control: { type: 'range', min: 0.5, max: 3, step: 0.1 },
      description: 'Size of hexagonal spacing',
    },
    InstanceSize: {
      control: { type: 'range', min: 0.1, max: 1, step: 0.05 },
      description: 'Size of each Instance',
    },
    InstanceColor: {
      control: 'color',
      description: 'Color of Instances',
    },
    waveSpeed: {
      control: { type: 'range', min: 0.1, max: 5, step: 0.1 },
      description: 'Speed of wave animation',
    },
    waveAmplitude: {
      control: { type: 'range', min: 0.1, max: 3, step: 0.1 },
      description: 'Height of wave oscillation',
    },
    waveFrequency: {
      control: { type: 'range', min: 0.1, max: 2, step: 0.1 },
      description: 'Frequency of wave pattern',
    },
  },
} satisfies Meta<typeof HexagonalInstances>;

export default meta;
type Story = StoryObj<typeof meta>;

// Wrapper pour afficher dans un Canvas
const SceneWrapper = (args: any) => (
  <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
    <Canvas camera={{ position: [0, 15, 15], fov: 60 }}>
      <color attach="background" args={['#0f0f1e']} />
      <ambientLight intensity={0.5} />
      <HexagonalInstances {...args} />
      <OrbitControls />
      <gridHelper args={[50, 50, '#333', '#222']} />
    </Canvas>
  </div>
);

export const Default: Story = {
  args: {
    width: 10,
    height: 10,
    hexSize: 1,
    InstanceSize: 0.3,
    InstanceColor: '#00ff88',
    waveSpeed: 1,
    waveAmplitude: 0.5,
    waveFrequency: 0.5,
  },
  render: SceneWrapper,
};

export const SmallGrid: Story = {
  args: {
    width: 5,
    height: 5,
    hexSize: 1.5,
    InstanceSize: 0.4,
    InstanceColor: '#ff6b9d',
    waveSpeed: 1.5,
    waveAmplitude: 1,
    waveFrequency: 0.8,
  },
  render: SceneWrapper,
};

export const LargeGrid: Story = {
  args: {
    width: 20,
    height: 20,
    hexSize: 0.8,
    InstanceSize: 0.2,
    InstanceColor: '#4a90e2',
    waveSpeed: 0.8,
    waveAmplitude: 0.3,
    waveFrequency: 0.3,
  },
  render: SceneWrapper,
};

export const FastWave: Story = {
  args: {
    width: 12,
    height: 12,
    hexSize: 1,
    InstanceSize: 0.3,
    InstanceColor: '#ffd700',
    waveSpeed: 3,
    waveAmplitude: 1.5,
    waveFrequency: 1,
  },
  render: SceneWrapper,
};

export const SlowWave: Story = {
  args: {
    width: 15,
    height: 15,
    hexSize: 0.8,
    InstanceSize: 0.25,
    InstanceColor: '#9b59b6',
    waveSpeed: 0.3,
    waveAmplitude: 0.8,
    waveFrequency: 0.2,
  },
  render: SceneWrapper,
};

export const HighFrequency: Story = {
  args: {
    width: 10,
    height: 10,
    hexSize: 1,
    InstanceSize: 0.3,
    InstanceColor: '#e74c3c',
    waveSpeed: 1,
    waveAmplitude: 0.5,
    waveFrequency: 1.5,
  },
  render: SceneWrapper,
};

export const Dense: Story = {
  args: {
    width: 25,
    height: 25,
    hexSize: 0.5,
    InstanceSize: 0.15,
    InstanceColor: '#1abc9c',
    waveSpeed: 1,
    waveAmplitude: 0.4,
    waveFrequency: 0.4,
  },
  render: SceneWrapper,
};

