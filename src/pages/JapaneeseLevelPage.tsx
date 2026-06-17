import { GameplayScene } from '@components/gameplay/GameplayScene'
import { HexaPlaneGeometrie } from '@components/graphic/geometry/HexaPlaneGeometrie.tsx';

export function JapaneeseLevelPage() {
  return <canvas>
    <HexaPlaneGeometrie
        sideLength={0.5}
        countX={20}
        countY={20}
        color="#f5d800"
        wireframe={true}
    />
  </canvas>
}

