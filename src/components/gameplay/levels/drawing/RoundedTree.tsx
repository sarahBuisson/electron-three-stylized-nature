import { useState } from 'react';
import { CatmullRomCurve3, LatheGeometry, Vector2, Vector3 } from 'three';
import { Blob } from '@components/gameplay/common/blob/Blob.tsx';
import { DrawingMaterial } from '@shaders/drawing/DrawingMaterial.tsx';

export default function RoundedTree(props: { points: Vector2[] }) {


    const [geometry] = useState(() => {


        let latheGeometry = new LatheGeometry(new CatmullRomCurve3(props.points.map(it => new Vector3(it.x/5, it.y/5, 0))).getPoints(100).map(it => new Vector2(it.x, it.y)));

        return latheGeometry;

    })

    return <group>


        <mesh geometry={geometry}>
            <DrawingMaterial></DrawingMaterial>
        </mesh>
    </group>

}

export function RoundedTree2() {
    return <RoundedTree points={[
        new Vector2(2, 0),
        new Vector2(0.7, 1),
        new Vector2(0.6, 4),
        new Vector2(2, 5),
        new Vector2(2.5, 6),
        new Vector2(2.3, 7),
        new Vector2(2.4, 10),
        new Vector2(0.5, 12),
        new Vector2(0, 12)
    ]}></RoundedTree>


        }

export function RoundedTree3() {
    return <RoundedTree points={[
        new Vector2(2.5, 0),
        new Vector2(0.8, 1),
        new Vector2(0.75, 2.5),
        new Vector2(2, 3),
        new Vector2(4, 4),
        new Vector2(3, 5),
        new Vector2(3.5, 6),
        new Vector2(2.8, 7.5),
        new Vector2(3.0, 8),
        new Vector2(0.5, 12),
        new Vector2(0, 12)
    ]}></RoundedTree>


        }
