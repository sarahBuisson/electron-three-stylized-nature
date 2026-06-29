
import { GrassWindMaterial } from '@components/gameplay/common/GrassWindMaterial.tsx';
import { Svg} from '@react-three/drei';
export function DrawedGrass() {



    return <Svg src={"./level/drawing/grass.svg"} fillMaterial={GrassWindMaterial}></Svg>

}
