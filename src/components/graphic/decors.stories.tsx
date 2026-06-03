// Button.stories.js
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Tree, TreeCase, Zone } from './decors.tsx';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { LandscapeScene } from '../gameplay/landscape/LandscapeScene.tsx';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import '../../styles/storybook.css';
import { TriangleGeometry } from './geometry/Triangle.tsx';
const meta = {
    // 👇 The component you're working on
    component: Tree,
} satisfies Meta<typeof Tree>;

export default meta;
// 👇 Type helper to reduce boilerplate
type Story = StoryObj<typeof meta>;

// 👇 A story named Primary that renders `<Button primary label="Button" />`
export const Primary: Story = {
    args: {
        primary: true,
        label: 'Tree',
        height: 2,
        position: [0, -2, 0]
    },
    style:{height:"800px"},
    render: args => <Canvas ><OrbitControls/><Physics><TreeCase {...args} /></Physics></Canvas>,
    name: 'Tree story'
};
