import { useState } from 'react';
import CustomTubeGeometry from '@components/gameplay/common/CustomTubeGeometry.ts';
import { CatmullRomCurve3, QuadraticBezierCurve3, Vector3 } from 'three';
import { Blob } from '@components/gameplay/common/blob/Blob.tsx';
import { DrawingMaterial } from '@shaders/drawing/DrawingMaterial.tsx';
let radiusFn = (i, j) => {
if(i<10)
    return (1 + j % 3) / (Math.log(i + 1))*0.09
   else
    return (2 + j % 3*0.5) / (Math.log(i + 1))*0.09
};
const pathBegining = [new Vector3(0, 0, 0),
    new Vector3(0, 2, 0),
    new Vector3(1, 2.5, 0)];
export default function LinearTree() {


    const [geometry] = useState(() => {
        return new CustomTubeGeometry(
            new CatmullRomCurve3([...pathBegining,
                new Vector3(2, 3, 0),]
            ),
            64,
            radiusFn,
            30)
    })

    const [geometry2] = useState(() => {

        return new CustomTubeGeometry(
            new CatmullRomCurve3([...pathBegining,
                new Vector3(1, 3, 1),]
            ),
            64,
            radiusFn,
            30)
    })
    const [geometry3] = useState(() => {
        return new CustomTubeGeometry(
            new CatmullRomCurve3([...pathBegining,
                new Vector3(2, 3.5, -1),]
            ),
            64,
            radiusFn,
            30)
    })
    return   <group>
        <group position={[0, 4.5, 0]}>
        <Blob></Blob></group>
        <mesh geometry={geometry}>
            <DrawingMaterial></DrawingMaterial>
        </mesh>
        <mesh geometry={geometry2}>
            <DrawingMaterial></DrawingMaterial>
        </mesh>
        <mesh geometry={geometry3}>
            <DrawingMaterial></DrawingMaterial>
        </mesh>
    </group>

}
