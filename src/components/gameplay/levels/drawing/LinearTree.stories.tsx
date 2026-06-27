import type { Meta, StoryObj } from '@storybook/react';
import LinearTree from '@components/gameplay/levels/drawing/LinearTree.tsx';
import { Canvas } from '@react-three/fiber';
import { HexagonalInstances } from '@components/gameplay/common/HexagonalInstance/HexagonalInstances.tsx';
import { OrbitControls } from '@react-three/drei';


const meta = {
    title: 'Custom/LinearTree',
    component: LinearTree,
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
} satisfies Meta<typeof LinearTree>;

export default meta;
type Story = StoryObj<typeof meta>;
const SceneWrapper = (args: any) => (
    <div style={{ width: '100vw', height: '100vh', background: '#1a1a2e' }}>
        <Canvas camera={{ position: [0, 15, 15], fov: 60 }}>
            <color attach="background" args={['#0f0f1e']} />
            <ambientLight intensity={0.5} />
           <LinearTree></LinearTree>
            <OrbitControls />
            <gridHelper args={[50, 50, '#333', '#222']} />
        </Canvas>
    </div>
);

export const LinearTreeStory: Story = {
    args: {

    },
    render: (args) => <SceneWrapper {...args} />,
};
