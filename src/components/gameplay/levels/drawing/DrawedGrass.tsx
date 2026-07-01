

import { Billboard, Svg, useTexture } from '@react-three/drei';
import { GrassSpriteWindMaterial } from '@components/gameplay/common/SpriteWindMaterial.tsx';

export function DrawedGrass() {




    const texture = useTexture("./level/drawing/grass.png");

    return<Billboard> <sprite position={[0, 0.5, 0]}  material={GrassSpriteWindMaterial} >

    </sprite></Billboard>

}
