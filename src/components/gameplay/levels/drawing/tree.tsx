import { CatmullRomCurve3, Color, DoubleSide, Euler, Vector3 } from 'three';
import React, { useState } from 'react';
import { DrawingMaterial } from '@shaders/drawing/DrawingMaterial.tsx';

export function computeSpiralPoint(animatePercent: number, nbrOfTurn: number, radius: number, offset: number | undefined, height: number): number[] {

    const y = ((animatePercent) / 100) * height; // Linear height increment
    const angle = ((100 - animatePercent) / 100) * Math.PI * nbrOfTurn * 2; // Angle for each point
    if(y<height*0.1) {

        const x = ((100 - animatePercent) / 100) * radius * Math.cos(angle + (offset || 0));
        const z = ((100 - animatePercent) / 100) * radius * Math.sin(angle + (offset || 0));
       return [x, y, z]
    }else
    if(y<height*0.7) {

        const x = 0.3* radius * Math.cos(angle + (offset || 0));
        const z = 0.3 * radius * Math.sin(angle + (offset || 0));
        return [x, y, z]
    }else{

        const x = animatePercent/100* radius * Math.cos(angle + (offset || 0));
        const z = animatePercent/100 * radius * Math.sin(angle + (offset || 0));
       return  [x, y, z]
    }
}

export const SpiralTree = (props: {
    radius: number;
    height: number;
    turns: number;
    offset?: number;
    stopHeight?: number,
    onAnimateComplete?: (points: Vector3[]) => void;
    onAnimateStart?: () => void;

} ) => {


    const {radius, height, turns, offset, stopHeight} = props;
    const pointCounts = 100; // Number of points per turn
    const totalPointCounts = pointCounts * turns;

    function getComputeSpiralPoint(animatePercent: number) {
        return computeSpiralPoint(animatePercent, turns, radius, offset, height);
    }

    const [points, setPoints] = React.useState<any[]>(()=>{
        const ret=[getComputeSpiralPoint(0.1)]
            for (let i = 1; i < 100; i++) {
                ret.push(getComputeSpiralPoint(i))
            }
            return ret;
    });


    return <group {...props}>
        {points.length > 1 ? <>

                <mesh position={[0, 0, 0]}>
                    <tubeGeometry
                        args={[new CatmullRomCurve3(points.map(it => new Vector3(...it))), points.length, 0.04, 16]}></tubeGeometry>

                    <DrawingMaterial

                    />
                </mesh>
                <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 3, 0]}>
                    <tubeGeometry
                        args={[new CatmullRomCurve3(points.map(it => new Vector3(...it))), points.length, 0.04, 16]}></tubeGeometry>

                    <DrawingMaterial

                    />
                </mesh> <mesh position={[0, 0, 0]} rotation={[0,2* Math.PI / 3, 0]}>
                    <tubeGeometry
                        args={[new CatmullRomCurve3(points.map(it => new Vector3(...it))), points.length, 0.04, 16]}></tubeGeometry>

                    <DrawingMaterial

                    />
                </mesh>

            </>
            : ""}
    </group>;
};
