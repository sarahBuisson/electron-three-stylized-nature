import React, { useMemo, useRef } from "react";
import vertexShader from "./vertexShader";
import fragmentShader from "./fragmentShader";
import { useFrame } from "@react-three/fiber";
import { Color, MathUtils, type Mesh } from "three";

export function Blob() {
    const mesh = useRef<Mesh>();
    const hover = useRef(false);
    const uniforms = useMemo(() => {
        return {
            u_time: { value: 0 },
            u_intensity: { value: 0.3 },
            uColor1:{value:new Color("#77aaaa")},
            uColor2:{value:new Color("#335A7b")},
            uColor3:{value:new Color("#88dFfa")},

        };
    });

    useFrame((state) => {
        const { clock } = state;
        if (mesh.current) {
            mesh.current.material.uniforms.u_time.value =
                0.4 * clock.getElapsedTime();

            mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
                mesh.current.material.uniforms.u_intensity.value,
                hover.current ? 1 : 0.15,
                0.02
            );
        }
    });
    return (
        <mesh
            ref={mesh}
            scale={1.5}
            position={[0, 0, 0]}
            onPointerOver={() => (hover.current = true)}
            onPointerOut={() => (hover.current = false)}
        >
            <sphereGeometry args={[1, 32, 32]} />
            <shaderMaterial
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
            />
        </mesh>
    );
};

