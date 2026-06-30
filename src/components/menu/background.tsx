import React, { useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Euler } from 'three';
import { RoundedTree2, RoundedTree3 } from '@components/gameplay/levels/drawing/RoundedTree.tsx';
import { DrawingMaterial } from '@shaders/drawing/DrawingMaterial.tsx';
import { useTexture } from '@react-three/drei';

export function Background() {

    const texture = useTexture("./level/drawing/hatch_3.jpg");
    const [angle, setAngle] = useState(0);
    useFrame(() => {
        setAngle((angle + 0.005) % 6)
    });


    return <group rotation={new Euler(0, angle, 0)}>
        <mesh position={[8, 0, 0]}>
            <sphereGeometry args={[1, 32, 32]}/>
            <superflatBisMaterial uTexture={texture} fogColor={"white"} ratioX={24} ratioY={4}></superflatBisMaterial>

        </mesh>
    </group>
}
