// Button.stories.js
import type { Meta, StoryObj } from '@storybook/your-framework';

import { Tree } from '../decors.tsx';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import '../../styles/storybook.css';
import { TriangleHollowGeometry, TriangleGeometry } from './Triangle.tsx';
import { StoryBookWrapper } from '../common/StoryBookWrapper.tsx';

const meta = {
    // 👇 The component you're working on
    component: TriangleGeometry,
} satisfies Meta<typeof TriangleGeometry>;

const metaHollow = {
    // 👇 The component you're working on
    component: TriangleHollowGeometry,
} satisfies Meta<typeof TriangleHollowGeometry>;

export default meta;
// 👇 Type helper to reduce boilerplate
type Story = StoryObj<typeof meta>;

// 👇 A story named Primary that renders `<Button primary label="Button" />`
export const TriangleHollowGeometryStory: StoryObj<typeof metaHollow> = {
    args: {
        height: 8,
        baseSize: 4,
        lineSize:  0.5,
    },
    style: {height: "800px"},
    render: (args: typeof metaHollow) => <StoryBookWrapper>
        <mesh>(
            <TriangleHollowGeometry {...args} />
        </mesh>
    </StoryBookWrapper>,
    name: 'TriangleHollowGeometry story'
};


export const TriangleGeometryStory: Story = {
    args: {
        height: 8,
        baseSize: 3
    },
    style: {height: "800px"},
    render: (args: typeof meta) => <StoryBookWrapper>
        <mesh>
            <TriangleGeometry {...args} />
        </mesh>
    </StoryBookWrapper>,
    name: 'TriangleGeometry story'
};

