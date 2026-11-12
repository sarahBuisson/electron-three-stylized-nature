import { useEffect, useRef, useState } from 'react';
import { GrassCase, Mountain, Sand, TreeCase, Water, Zone } from '../../graphic/decors.tsx';
import { computeAveragePositionHexa, ContentRender, type ContentRenderHandle } from './ContentRender.tsx';
import { Kase2D } from '@services/game/labyrinth/tableau.ts';
import { GrassWindMaterial } from '@components/gameplay/common/GrassWindMaterial.tsx';
import { useFrame } from '@react-three/fiber';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import { HexagonalWave } from '@components/gameplay/common/hexaWave/HexagonalWave.tsx';
import type { MapToPlay } from '@utils/mapPlayStorage.ts';
import LinearTree from '@components/gameplay/levels/drawing/LinearTree.tsx';
import { DrawingMaterial } from '@shaders/drawing/DrawingMaterial.tsx';
import { DrawedGrass } from '../levels/drawing/DrawedGrass.tsx';
import { RoundedTree2, RoundedTree3 } from '@components/gameplay/levels/drawing/RoundedTree.tsx';
import { useTexture } from '@react-three/drei';
import { GrassSpriteWindMaterial } from '@components/gameplay/common/SpriteWindMaterial.tsx';


export const TableauToThreeContent = (props: { mapToPlay: MapToPlay , callback?:()=>void}) => {
    const contentRef = useRef<ContentRenderHandle>(null);
    const backgroundTexture = useTexture('./aquarelle.jpg');
const [alreadyCalled, setAlreadyCalled] = useState(false);
    useEffect(() => {
        if(alreadyCalled) return;

        console.log("start rendering tableau", props.mapToPlay.creation);
        if (props.mapToPlay.mapType == "drawing"||props.mapToPlay.mapType == "engraving") {
            let texturePath = "./level/drawing/hatch_";
            let extension = ".jpg";
            if(props.mapToPlay.mapType == "engraving"){
                texturePath = "./level/engraving/ray_";
                extension = ".png";
            }

            props.mapToPlay.tableau?.allKases().flat().forEach((kase) => {
                let kaseRender;
                switch (kase.content) {
                    case "water":

                        kaseRender = <Zone texturePath={`${texturePath}1${extension}`}></Zone>;
                        break;

                    case "sand":
                        kaseRender = <Zone texturePath={`${texturePath}2${extension}`}></Zone>
                        break;

                    case "tree":
                        if (Math.random() < 0.5) {
                            kaseRender = <><Zone texturePath={`${texturePath}3${extension}`}></Zone><RoundedTree2></RoundedTree2></>
                        } else if (Math.random() < 0.1) {
                            kaseRender = <group rotation={[0,Math.random(),0]}><Zone texturePath={`${texturePath}3${extension}`}></Zone><LinearTree></LinearTree></group>
                        } else {
                            kaseRender = <><Zone texturePath={`${texturePath}3${extension}`}></Zone><RoundedTree3></RoundedTree3></>
                        }

                        break;
                    case "grass":
                        kaseRender = <>
                            <Zone texturePath={`${texturePath}1${extension}`}></Zone>
                            <DrawedGrass></DrawedGrass>
                            </>
                        break;
                    case "mountain": {
                        const rocks = []
                        for (let i = 0; i < Math.random() * 3; i++) {
                            rocks.push(<mesh position={[Math.random() * 0.5, 0, Math.random() * 0.5]} >
                                <sphereGeometry args={[Math.random() + 0.1, 12, 12]}></sphereGeometry>
                                <DrawingMaterial></DrawingMaterial>
                            </mesh>)
                        }

                        kaseRender = <><Zone texturePath={`${texturePath}3${extension}`}></Zone>{rocks}</>
                    }
                        break;
                    default:
                        kaseRender = <Zone texturePath={`${texturePath}1${extension}`}></Zone>
                }
                props.mapToPlay.tableau?.allKases().flat().forEach((kase) => {

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
                setAlreadyCalled(true);
                return;
            });
        }
        if (props.mapToPlay.mapType == "geometric") {
            props.mapToPlay.tableau?.allKases().flat().forEach((kase) => {
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
                props.mapToPlay.tableau?.allKases().flat().forEach((kase) => {

                    const nei = props.mapToPlay.tableau.neighbors(kase);
                    if (nei.length < 6)
                        props.mapToPlay.tableau.getAllDirections().forEach((dir) => {
                            if (!props.mapToPlay.tableau.neighborAt(kase, dir.x, dir.y)) {

                                //placer un mur invisible

                                contentRef.current?.setWithKase(new Kase2D(kase.x + dir.x*1.2, kase.y + dir.y*1.2),
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

        console.log("rendering tableau", props.mapToPlay.tableau);
    }, [props.mapToPlay, alreadyCalled ]);
    useFrame((state) => {
        GrassWindMaterial.uniforms.time.value = state.clock.elapsedTime / 4;
        GrassSpriteWindMaterial.uniforms.time.value = state.clock.elapsedTime / 4;

    })

    return <>

        <primitive attach="background" object={backgroundTexture} />
        <ContentRender ref={contentRef}
                       onRendered={props.callback}
                       computePosition={computeAveragePositionHexa}/>

    </>
}
