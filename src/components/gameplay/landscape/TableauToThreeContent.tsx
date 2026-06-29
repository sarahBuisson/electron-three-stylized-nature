import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { GrassCase, Mountain, Sand, TreeCase, Water, Zone } from '../../graphic/decors.tsx';
import { computeAveragePositionHexa, ContentRender } from './ContentRender.tsx';
import { Kase2D, type Tableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';
import { GrassWindMaterial } from '@components/gameplay/common/GrassWindMaterial.tsx';
import { useFrame } from '@react-three/fiber';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import { HexagonalWave } from '@components/gameplay/common/hexaWave/HexagonalWave.tsx';
import type { MapToPlay } from '@utils/mapPlayStorage.ts';
import LinearTree from '@components/gameplay/levels/drawing/LinearTree.tsx';
import { DrawingMaterial } from '@shaders/drawing/DrawingMaterial.tsx';
import { DrawedGrass } from '../levels/drawing/DrawedGrass.tsx';
import { Euler } from 'three';


export const TableauToThreeContent = (props: { mapToPlay: MapToPlay }) => {
    const contentRef = useRef<typeof ContentRender>(null);

    useEffect(() => {
        if (props.mapToPlay.mapType == "drawing") {
            props.mapToPlay.tableau?.allKases().flat().forEach((kase, index) => {
                let kaseRender;
                switch (kase.content) {
                    case "water":
                        kaseRender =<></>;
                        break;

                    case "sand":
                        kaseRender = <></>
                        break;

                    case "tree":
                        kaseRender =<group rotation={new Euler(0,Math.random()*6,0)}><LinearTree></LinearTree></group>
                        break;
                    case "grass":
                        kaseRender = <DrawedGrass ></DrawedGrass>
                        break;
                    case "mountain":
                        kaseRender = <mesh>
                            <sphereGeometry args={[Math.random(),12,12]}></sphereGeometry>
                        <DrawingMaterial></DrawingMaterial>
                        </mesh>
                        break;
                    default:
                        kaseRender = <Zone></Zone>
                }
                props.mapToPlay.tableau?.allKases().flat().forEach((kase, index) => {

                    const nei = props.mapToPlay.tableau.neighbors(kase);
                    if (nei.length < 6)
                        props.mapToPlay.tableau.getAllDirections().forEach((dir) => {
                            if (!props.mapToPlay.tableau.neighborAt(kase, dir.x, dir.y)) {

                                //placer un mur invisible

                                contentRef.current?.setWithKase(new Kase2D(kase.x + dir.x, kase.y + dir.y),
                                    <RigidBody type="fixed"><CylinderCollider


                                        friction={0.5}
                                        restitution={0.5}
                                        args={[1, 1,]}></CylinderCollider>
                                        <HexagonalWave></HexagonalWave></RigidBody>);
                            }
                        })

                })
                contentRef.current?.setWithKase(kase, kaseRender);
                return;
            });
        }
        if (props.mapToPlay.mapType == "geometric") {
            props.mapToPlay.tableau?.allKases().flat().forEach((kase, index) => {
                let kaseRender;
                switch (kase.content) {
                    case "water":
                        kaseRender = <Water></Water>;
                        break;

                    case "sand":
                        kaseRender = <Sand></Sand>
                        break;

                    case "tree":
                        kaseRender = <TreeCase height={kase.scale}></TreeCase>
                        break;
                    case "grass":
                        kaseRender = <GrassCase height={kase.scale}></GrassCase>
                        break;
                    case "mountain":
                        kaseRender = <Mountain height={kase.scale}></Mountain>
                        break;
                    default:
                        kaseRender = <Zone></Zone>
                }
                props.mapToPlay.tableau?.allKases().flat().forEach((kase, index) => {

                    const nei = props.mapToPlay.tableau.neighbors(kase);
                    if (nei.length < 6)
                        props.mapToPlay.tableau.getAllDirections().forEach((dir) => {
                            if (!props.mapToPlay.tableau.neighborAt(kase, dir.x, dir.y)) {

                                //placer un mur invisible

                                contentRef.current?.setWithKase(new Kase2D(kase.x + dir.x, kase.y + dir.y),
                                    <RigidBody type="fixed"><CylinderCollider


                                        friction={0.5}
                                        restitution={0.5}
                                        args={[1, 1,]}></CylinderCollider>
                                        <HexagonalWave></HexagonalWave></RigidBody>);
                            }
                        })

                })
                contentRef.current?.setWithKase(kase, kaseRender);
                return;
            });

        }

    }, [props.mapToPlay
    ]);
    console.log("land")
    useFrame((state) => (GrassWindMaterial.uniforms.time.value = state.clock.elapsedTime / 4))

    useImperativeHandle(props.ref, () => ({

        setWithKase(kase: Kase2D, element: React.JSX.Element) {
            const position = computePosition(kaseSize, [kase]);
            contentMap.set(computeKey(position), <group position={position}>{element}</group>);
            setContentMap(new Map(contentMap));
        },

        setNearKase(kase: Kase2D, element: React.JSX.Element) {
            const position = computePosition(kaseSize, [kase]);
            contentMap.set(computeKey(position), <group position={position}>{element}</group>);
            setContentMap(new Map(contentMap));
        },
        setBetweenKases(element: React.JSX.Element, kase1: Kase2D, kase2: Kase2D) {

            const position = computePosition(kaseSize, [kase1, kase2]);

            contentMap.set((computeKey(position)), element);
            setContentMap(new Map(contentMap))
        },
        setAtCornerBetweenKases(element: React.JSX.Element, kases: Kase2D[]) {

            const position = computePosition(kaseSize, kases);

            contentMap.set((computeKey(position)), element);
            setContentMap(new Map(contentMap))
        },

        //TODO : ne marche pas en orthogonal, seulement en hexagonal

        setBetweenKasesCorner(element: React.JSX.Element, kaseMain: Kase2D, kases: Kase2D[]) {
            const position = computePosition(kaseSize, [kaseMain, ...kases]);
            contentMap.set(computeKey(position), element);
            setContentMap(new Map(contentMap))
        },
        get(positionKey: string) {
            return contentMap.get(positionKey);
        }
    }));
    return <>
        <ContentRender ref={contentRef}
                       computePosition={computeAveragePositionHexa}/>

    </>
}
