
import { GrassWindMaterial } from '@components/gameplay/common/GrassWindMaterial.tsx';
import { Svg, useTexture } from '@react-three/drei';
export function DrawedGrass() {


    const texture = useTexture("./level/drawing/grass.png");
    return <sprite position={[0, 0.5, 0]} >
        <spriteMaterial  map={texture} ></spriteMaterial>
    </sprite>

}
