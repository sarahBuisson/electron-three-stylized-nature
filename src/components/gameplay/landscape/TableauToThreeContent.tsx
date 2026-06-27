
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import { GrassCase, Mountain, Sand, TreeCase, Water, Zone } from '../../graphic/decors.tsx';
import { computeAveragePositionHexa, ContentRender } from './ContentRender.tsx';
import { Kase2D, type Tableau } from '@services/game/labyrinth/tableau.ts';
import type { KaseLandscape } from '@components/gameplay/landscape/service.ts';
import { GrassWindMaterial } from '@components/gameplay/common/GrassWindMaterial.tsx';
import { useFrame } from '@react-three/fiber';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import { HexagonalWave } from '@components/gameplay/common/hexaWave/HexagonalWave.tsx';


export const TableauToThreeContent = (props:{ tableau:Tableau<KaseLandscape>}) => {
    const contentRef = useRef<typeof ContentRender>(null);

    useEffect(() => {
        props.tableau?.allKases().flat().forEach((kase, index) => {
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
            props.tableau?.allKases().flat().forEach((kase, index) => {

              const nei = props.tableau.neighbors(kase);
              if(nei.length<6)
                  props.tableau.getAllDirections().forEach((dir)=> {
                  if(!props.tableau.neighborAt(kase,dir.x,dir.y)){

                      //placer un mur invisible

                      contentRef.current?.setWithKase(new Kase2D(kase.x + dir.x, kase.y + dir.y),
                          <RigidBody type="fixed" ><CylinderCollider


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



    }, [props.tableau]);
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

            const position = computePosition(kaseSize, [kase1,kase2]);

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
            const position = computePosition(kaseSize, [kaseMain,...kases]);
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
