import React, { useMemo } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { extend } from '@react-three/fiber';

export const TriangleGeometry = (props: { baseSize: number, height: number }) => {
    const shape = React.useMemo(() => {
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(0, props.height); // Top vertex
        triangleShape.lineTo(-props.baseSize / 2, 0); // Bottom-left vertex
        triangleShape.lineTo(props.baseSize / 2, 0); // Bottom-right vertex
        triangleShape.closePath(); // Close the triangle
        return triangleShape;
    }, []);

    return (

        <extrudeGeometry {...props}
                         args={[
                             shape,
                             {depth: 0.0, steps: 0, bevelEnabled: false}, // Extrusion settings
                         ]}
        />

    );
};


export const TriangleHollowGeometry = (props: {
    baseSize: number,
    height: number,
    lineSize: number
}) => {
    const shape = React.useMemo(() => {
        const triangleShape = new THREE.Shape();
        triangleShape.moveTo(0, props.height); // Top vertex
        triangleShape.lineTo(-props.baseSize / 2, 0); // Bottom-left vertex
        triangleShape.lineTo(-props.baseSize / 2 + props.lineSize, 0); // Bottom-left vertex
        let innerHeight = props.height- 4.0 * props.lineSize / (props.baseSize / (props.lineSize + props.baseSize));

        triangleShape.lineTo(0,  innerHeight); // Bottom-left vertex

        triangleShape.lineTo(props.baseSize / 2 - props.lineSize, 0); // Bottom-right vertex
        triangleShape.lineTo(props.baseSize / 2, 0); // Bottom-right vertex
        triangleShape.closePath(); // Close the triangle
        return triangleShape;
    }, []);
    return (

        <extrudeGeometry
            args={[
                shape,
                {depth: 0.0, steps: 0, bevelEnabled: false}, // Extrusion settings
            ]}
        />

    );
};
extend({TriangleGeometry, TriangleHollowGeometry});
