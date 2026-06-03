import React, { useImperativeHandle, useState } from 'react';

import {  Vector3 } from 'three';
import type { Kase2D } from '@services/game/labyrinth/tableau.ts';


const invRec3 = 1 / Math.sqrt(3);

export const computeAveragePositionHexa = (kaseSize: number, kases: Kase2D[]): Vector3 => {
    let x = 0, y = 0
    kases.forEach(kase => {
        x += kase.x;
        y += kase.y;
    });
    // [kase.x * 1.5, 0, (kase.x * 0.5 + kase.y) / invRec3]


    let ret = new Vector3(x * 1.5, 0, (x * 0.5 + y) / invRec3);
    ret = ret.multiplyScalar(1.0 * kaseSize / kases.length);
    return ret;
}

export function computeAveragePositionOrtho(kaseSize: number, kases: Kase2D[]) {
    const ret = new Vector3(0, 0, 0);
    kases.forEach(kase => {
        ret.x += kase.x;
        ret.z += kase.y;
    });
    ret.multiplyScalar(1.0 * kaseSize / kases.length);

    return ret;
}

function computeKey(v: Vector3): string {
    return floorWithDecimal(v.x, 2) + "/" + floorWithDecimal(v.y) + "/" + floorWithDecimal(v.z);
}

function floorWithDecimal(value: number, decimal: number = 2): number {
    const factor = Math.pow(10.0, decimal);
    return Math.floor(factor * value) / factor;
}


export const ContentRender = (props: {
    ref: any,
    computePosition?: (kaseSize:number,kases: Kase2D[]) => Vector3,
    kaseSize?: number
}) => {

    const {
        kaseSize = 1,
        computePosition = computeAveragePositionOrtho
    } = props;
    const [contentMap, setContentMap] = useState(() => new Map<string, React.JSX.Element>());
    useImperativeHandle(props.ref, () => ({

        setWithKase(kase: Kase2D, element: React.JSX.Element) {
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
        {contentMap.values()}
    </>
}
