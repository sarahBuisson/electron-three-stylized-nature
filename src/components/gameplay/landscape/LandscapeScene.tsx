import {  Sky } from '@react-three/drei';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { LandscapeContent } from './LandscapeContent.tsx';
import React, { useRef } from 'react';
import { Euler } from 'three';
import { saveImage } from './service.ts';
import { useThree } from '@react-three/fiber';
import { type HexagonalTableau, Kase2D } from '@services/game/labyrinth/tableau.ts';

export function LandscapeScene(props: { tableau:HexagonalTableau<Kase2D>}) {

    const {gl, scene, camera} = useThree();

    const contentRef = useRef<typeof LandscapeContent>(null);
    return <>

        <Physics debug={true}>
            <LandscapeContent ref={contentRef} tableau={props.tableau}></LandscapeContent>

            <RigidBody type="fixed"
                       friction={0.5}
                       colliders={false}>
                <mesh receiveShadow position={[10, -5, 10]} rotation-x={-Math.PI / 2}>
                    <planeGeometry args={[1000, 1000]}/>
                    <meshStandardMaterial color="green"/>
                </mesh>
                <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]}/>
            </RigidBody>

            <mesh onPointerDown={() => saveImage(gl, scene, camera)}>
                <sphereGeometry></sphereGeometry>
            </mesh>
        </Physics>
    </>;
}
