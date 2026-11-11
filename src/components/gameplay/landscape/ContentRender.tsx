import React, { useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

import {  Vector3 } from 'three';
import type { Kase2D } from '@services/game/labyrinth/tableau.ts';


export { computeAveragePositionHexa } from './hexPosition.ts';

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

function RenderedContentNotification(props: {
    version: number,
    isCurrent: () => boolean,
    onRendered: () => void
}) {
    const invalidate = useThree(state => state.invalidate);
    const active = useRef(false);
    const renderedFrame = useRef(false);

    useLayoutEffect(() => {
        active.current = true;
        renderedFrame.current = false;
        invalidate();
        return () => {
            active.current = false;
        };
    }, [props.version, invalidate]);

    useFrame(() => {
        if (!active.current || !props.isCurrent()) return;

        if (!renderedFrame.current) {
            renderedFrame.current = true;
            invalidate();
            return;
        }

        props.onRendered();
    });

    return null;
}

export type ContentRenderHandle = {
    setWithKase(kase: Kase2D, element: React.JSX.Element): void,
    setBetweenKases(element: React.JSX.Element, kase1: Kase2D, kase2: Kase2D): void,
    setAtCornerBetweenKases(element: React.JSX.Element, kases: Kase2D[]): void,
    setBetweenKasesCorner(element: React.JSX.Element, kaseMain: Kase2D, kases: Kase2D[]): void,
    get(positionKey: string): React.JSX.Element | undefined
};

export const ContentRender = (props: {
    ref?: React.Ref<ContentRenderHandle>,
    computePosition?: (kaseSize:number,kases: Kase2D[]) => Vector3,
    kaseSize?: number,
    onRendered?: () => void
}) => {

    const {
        kaseSize = 1,
        computePosition = computeAveragePositionOrtho,
        ref
    } = props;
    const [content, setContent] = useState(() => ({
        map: new Map<string, React.JSX.Element>(),
        version: 0
    }));
    const latestContent = useRef(content.map);
    const latestVersion = useRef(0);
    const notifiedVersion = useRef(0);

    const setElement = (key: string, element: React.JSX.Element) => {
        const map = new Map(latestContent.current);
        map.set(key, element);
        latestContent.current = map;
        const version = ++latestVersion.current;
        setContent({ map, version });
    };

    useImperativeHandle(ref, () => ({

        setWithKase(kase: Kase2D, element: React.JSX.Element) {
            const position = computePosition(kaseSize, [kase]);
            setElement(computeKey(position), <group position={position}>{element}</group>);
        },
        setBetweenKases(element: React.JSX.Element, kase1: Kase2D, kase2: Kase2D) {

            const position = computePosition(kaseSize, [kase1,kase2]);

            setElement(computeKey(position), element);
        },
        setAtCornerBetweenKases(element: React.JSX.Element, kases: Kase2D[]) {

            const position = computePosition(kaseSize, kases);

            setElement(computeKey(position), element);
        },

        //TODO : ne marche pas en orthogonal, seulement en hexagonal

        setBetweenKasesCorner(element: React.JSX.Element, kaseMain: Kase2D, kases: Kase2D[]) {
            const position = computePosition(kaseSize, [kaseMain,...kases]);
            setElement(computeKey(position), element);
        },
        get(positionKey: string) {
            return latestContent.current.get(positionKey);
        }
    }));

    return <>
        {content.map.values()}
        {content.version > 0 && <RenderedContentNotification
            version={content.version}
            isCurrent={() => content.version === latestVersion.current &&
                content.version !== notifiedVersion.current}
            onRendered={() => {
                notifiedVersion.current = content.version;
                props.onRendered?.();
            }}
        />}
    </>
}
