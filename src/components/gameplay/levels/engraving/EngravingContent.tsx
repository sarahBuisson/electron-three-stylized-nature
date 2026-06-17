import { useGLTF } from '@react-three/drei';
import { useMemo } from 'react';
import { type BufferGeometry, Mesh } from 'three';
import { EngravingMaterial } from '@shaders/engraving/EngravingMaterial.tsx';


export default function EngravingContent() {

    const gltf = useGLTF("./level/engraving/scene.gltf");

    const geometries = useMemo(() => {
        const extractedGeometries: BufferGeometry[] = [];
        gltf.scene.traverse((child) => {
            if (child instanceof Mesh && child.geometry) {
                extractedGeometries.push(child.geometry.clone());
            }
        });
        return extractedGeometries;
    }, [gltf]);

    return (
        <group >
            {geometries.map((geometry, index) => (
                <mesh key={index} geometry={geometry}>
                  <EngravingMaterial></EngravingMaterial>
                </mesh>
            ))}
        </group>
    );


}
