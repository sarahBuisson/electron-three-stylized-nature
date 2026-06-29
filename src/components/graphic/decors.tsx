import { TriangleGeometry, TriangleHollowGeometry } from './geometry/Triangle.tsx';
import React, { JSX, useState } from 'react';
import { useTexture } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { FlatMaterial } from './material/flatMaterial/flatMaterial.tsx';
import { SuperflatBisMaterial, SuperflatMaterial } from './material/superflatMaterial/superflatMaterial.tsx';
import { HexagonGeometry } from './geometry/HexagonGeometry.tsx';
import { CylinderCollider } from '@react-three/rapier';
import { CatmullRomCurve3, Vector3 } from 'three';
import { Color } from 'three';
import { GrassWindMaterial } from '@components/gameplay/common/GrassWindMaterial.tsx';
import CustomTubeGeometry from '@components/gameplay/common/CustomTubeGeometry.ts';

extend({FlatMaterial, SuperflatMaterial, SuperflatBisMaterial});

export function Mountain(props: { height: number }) {
    const texture = useTexture("./seamless.jpg");
    return <>
        <mesh scale={props.height}>
            <TriangleGeometry baseSize={props.height} height={props.height * 0.7}></TriangleGeometry>
            <superflatMaterial uTexture={texture} fogColor={"white"} ratioX={24} ratioY={4}></superflatMaterial>

        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>


            <HexagonGeometry radius={1}></HexagonGeometry>
            <superflatBisMaterial uTexture={texture} fogColor={"white"} ratioX={24} ratioY={4}></superflatBisMaterial>

        </mesh>
        <CylinderCollider


            friction={0.5}
            restitution={0.5}
            args={[1, 1,]}></CylinderCollider>
    </>
}

export function TreeOld(props: { position: [number, number, number], height: number }) {
    const texture = useTexture("./pine.jpg");
    return <mesh position={props.position} scale={props.height}>


        <TriangleGeometry baseSize={1} height={props.height}></TriangleGeometry>
        <superflatMaterial uTexture={texture} fogColor={"white"} ratioX={24} ratioY={4}></superflatMaterial>

    </mesh>
}

export function Tree(props: { position?: Vector3 | [number, number, number], height: number, numberOfLines?: number }) {
    const texture = useTexture("./greenPlume.png");
    const wtexture = useTexture("./ivoryLeather.jpg");
    const ctexture = useTexture("./copper.jpg");

    const lineSize = 0.05;
    const baseSize = 1;
    let extraTriangles = null
    console.log(props.numberOfLines)
    if (props.numberOfLines === 2) {
        extraTriangles = <>
            <mesh>
                <TriangleHollowGeometry baseSize={baseSize + lineSize * 2 * 2} lineSize={lineSize}
                                        height={props.height / (baseSize / 2 / (baseSize / 2 + lineSize * 2))}></TriangleHollowGeometry>
                <superflatMaterial uTexture={ctexture} fogColor={"white"} ratioX={1} ratioY={1}></superflatMaterial>
            </mesh>
            <mesh>
                <TriangleHollowGeometry baseSize={baseSize + lineSize * 2} lineSize={lineSize}
                                        height={props.height / (baseSize / 2 / (baseSize / 2 + lineSize))}></TriangleHollowGeometry>
                <superflatMaterial uTexture={wtexture} fogColor={"white"} ratioX={1} ratioY={1}></superflatMaterial>
            </mesh>
        </>
    }
    if (props.numberOfLines === 1) {
        extraTriangles = <>
            <mesh>
                <TriangleHollowGeometry baseSize={baseSize + lineSize} lineSize={lineSize}
                                        height={props.height / (baseSize / 2 / (baseSize / 2 + lineSize))}></TriangleHollowGeometry>
                <superflatMaterial uTexture={ctexture} fogColor={"white"} ratioX={1} ratioY={1}></superflatMaterial>
            </mesh>
        </>
    }
    if (props.numberOfLines === 3) {
        extraTriangles = <>
            <mesh>
                <TriangleHollowGeometry baseSize={baseSize + lineSize * 2} lineSize={lineSize}
                                        height={props.height / (baseSize / 2 / (baseSize / 2 + lineSize))}></TriangleHollowGeometry>
                <superflatMaterial uTexture={ctexture} fogColor={"white"} ratioX={1} ratioY={1}></superflatMaterial>
            </mesh>
        </>
    }

    return <group {...props}>
        {extraTriangles}
        <mesh position={[0, -0.5, 0]}>
            <TriangleGeometry baseSize={1} height={props.height}></TriangleGeometry>
            <superflatMaterial uTexture={texture} fogColor={"white"} ratioX={1} ratioY={1}></superflatMaterial>
        </mesh>
    </group>
}

export function TreeCase(props: { height: number }): JSX.Element {

    return <group {...props}>
        <TreeGroup height={props.height}></TreeGroup>

        <CylinderCollider
            friction={0.5}
            restitution={0.5}
            args={[1, 1,]}></CylinderCollider>
    </group>

};

export function GrassCase(props: { height: number }): JSX.Element {

    const [geoGrass, setGeoGrass] = useState(() => {new CustomTubeGeometry(new CatmullRomCurve3([new Vector3(0, 0, 0), new Vector3(0.25, 0, 0), new Vector3(0, 0, 0.5), new Vector3(-0.75, 0, 0)]), 1, (a,b)=>(a%2)?Math.random():0, 2,false)})
    let [grass, setGrass] = useState(() => {
        const grasss = []
        for (let i = 0; i < 7; i++) {
            grasss.push(
                <GrassGroup position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]}></GrassGroup>)
        }
        return grasss;
    })
    return <group {...props}>
        {grass}

    </group>

};


export function GrassGroup(props: { position?: Vector3 }) {
    let [grass, setGrass] = useState(() => {
        const grasss = []
        for (let i = 0; i < 7; i++) {

            grasss.push(
                <mesh
                    position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]}
                    material={ GrassWindMaterial}
                ><TriangleGeometry baseSize={0.1}
                                   height={0.2 + Math.random()}

                ></TriangleGeometry>
                </mesh>)


        }
        return grasss
    })


    return <group>
        {grass}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <HexagonGeometry radius={1}></HexagonGeometry>
            <meshStandardMaterial color={("lightGreen")}></meshStandardMaterial>

        </mesh>
    </group>

};


export function TreeGroup(props: { height: number }) {
    const[trees, setTrees] = useState(() => {
        const trees = []
        for (let i = 0; i < 7; i++) {
            trees.push(<Tree height={Math.random() + props.height}
                             numberOfLines={Math.floor(3 * Math.random())}
                             position={[Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5]}></Tree>)
        }
        return trees;
    })


    const texture = useTexture("./greenPlume.png");
    return <group>
        {trees}
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <HexagonGeometry radius={1}></HexagonGeometry>
            <superflatBisMaterial uTexture={texture} fogColor={"white"} ratioX={1} ratioY={1}></superflatBisMaterial>

        </mesh>
        <CylinderCollider


            friction={0.5}
            restitution={0.5}
            args={[1, 1,]}></CylinderCollider>
    </group>

};

export function Water() {
    const texture = useTexture("./aquarelleSmall.jpg");
    return <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <HexagonGeometry radius={1}></HexagonGeometry>
        <meshStandardMaterial map={texture} fogColor={"white"}></meshStandardMaterial>
        <superflatBisMaterial uTexture={texture} fogColor={"white"} ratioY={1.5}></superflatBisMaterial>
    </mesh>
}

export function Sand() {
    const texture = useTexture("./sand.jpg");
    return <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <HexagonGeometry radius={1}></HexagonGeometry>
        <meshStandardMaterial map={texture} fogColor={"white"}></meshStandardMaterial>
        <superflatBisMaterial uTexture={texture} fogColor={"white"} ratioY={1.5}></superflatBisMaterial>
    </mesh>
}

function moveHere(position: [number, number, number]) {
    console.log("moveHere")
}

export function Zone() {
    const texture = useTexture("./sand.jpg");

    return <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <HexagonGeometry radius={1}></HexagonGeometry>
        <meshStandardMaterial map={texture} fogColor={"white"}></meshStandardMaterial>
    </mesh>
}
