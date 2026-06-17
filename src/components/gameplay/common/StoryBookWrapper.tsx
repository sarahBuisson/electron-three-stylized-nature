import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';

export function StoryBookWrapper(props: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <Canvas>
            <OrbitControls></OrbitControls>
            <Physics>
            {props.children}
            </Physics>
        </Canvas>
    );
}
