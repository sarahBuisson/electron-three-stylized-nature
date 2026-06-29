import {  Sky } from '@react-three/drei';
import { CuboidCollider, Physics, RigidBody } from '@react-three/rapier';
import { TableauToThreeContent } from './TableauToThreeContent.tsx';
import React, { useRef } from 'react';
import { Euler, Vector2, Vector3 } from 'three';
import { saveImage } from './service.ts';
import { useThree } from '@react-three/fiber';
import { type HexagonalTableau, Kase2D } from '@services/game/labyrinth/tableau.ts';
import { MapToPlay } from '@utils/mapPlayStorage.ts';

export function LandscapeScene(props: { tableau:HexagonalTableau<Kase2D>}) {

    const {gl, scene, camera} = useThree();

    const contentRef = useRef<typeof TableauToThreeContent>(null);
    return <>

        <Physics>
            <TableauToThreeContent ref={contentRef} mapToPlay={new MapToPlay(props.tableau, new Vector2(4,4), new Vector2(7,4),new Euler(), "geometric")}></TableauToThreeContent>

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
