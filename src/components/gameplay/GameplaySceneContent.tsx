import { useMemo } from 'react'
import { Physics } from '@react-three/rapier'
import { PerspectiveCamera } from '@react-three/drei'
import { ShaderMaterial } from 'three'
import type { Keybinds } from '@models/Keybinds'
import { EffectComposer, Outline, Select, Selection } from '@react-three/postprocessing'
import { InteractiveCube } from './InteractiveCube'
import { GroundPlane } from './GroundPlane'
import { CharacterController } from './CharacterController'
import { GameplayController } from './GameplayController'

export interface CubeConfig {
  position: [number, number, number]
  scale: number
  hoverMessage: string
  clickMessage: string
  autoLookTarget: [number, number, number]
  color: string
}

export interface GameplaySceneContentProps {
  keybinds: Keybinds
  onSnapshotTaken: (dataUrl: string) => void
  material: ShaderMaterial
  onMessageUpdate: (type: 'hover' | 'click', message: string) => void
}

function Level(cubeConfigs: CubeConfig[], onMessageUpdate: (type: ("hover" | "click"), message: string) => void, material: ShaderMaterial) {
    return <Selection>
        <EffectComposer autoClear={false}>
            <Outline
                visibleEdgeColor={0xff00ff}
                hiddenEdgeColor={0x99aaff}
                edgeStrength={6}
                xRay={false}
            />
        </EffectComposer>
        <Select enabled={true}>
            {cubeConfigs.map((config, index) => (
                <InteractiveCube
                    key={index}
                    position={config.position}
                    scale={config.scale}
                    hoverMessage={config.hoverMessage}
                    clickMessage={config.clickMessage}
                    onHover={() => onMessageUpdate('hover', config.hoverMessage)}
                    onUnhover={() => onMessageUpdate('hover', '')}
                    onClick={() => onMessageUpdate('click', config.clickMessage)}
                    autoLookTarget={config.autoLookTarget}
                    material={material}
                />
            ))}
        </Select>
    </Selection>;
}

export function GameplaySceneContent({
  keybinds,
  onSnapshotTaken,
  material,
  onMessageUpdate,
}: GameplaySceneContentProps) {
  const cubeConfigs: CubeConfig[] = useMemo(
    () => [
      {
        position: [0, 1, -10],
        scale: 2,
        hoverMessage: 'Red Cube - Hover for more',
        clickMessage: 'Red Cube Clicked! Look at me with M+Click',
        autoLookTarget: [0, 1, -10],
        color: '#ff6b6b',
      },
      {
        position: [-5, 0.75, -8],
        scale: 1.5,
        hoverMessage: 'Blue Cube - Interactive',
        clickMessage: 'Blue Cube Selected!',
        autoLookTarget: [-5, 0.75, -8],
        color: '#4ecdc4',
      },
      {
        position: [5, 0.75, -8],
        scale: 1.5,
        hoverMessage: 'Green Cube - Beautiful',
        clickMessage: 'Green Cube Activated!',
        autoLookTarget: [5, 0.75, -8],
        color: '#95e1d3',
      },
      {
        position: [-3, 0.6, -15],
        scale: 1.2,
        hoverMessage: 'Purple Cube - Far Away',
        clickMessage: 'Purple Cube - Distance Test',
        autoLookTarget: [-3, 0.6, -15],
        color: '#c9b1ff',
      },
      {
        position: [3, 0.6, -15],
        scale: 1.2,
        hoverMessage: 'Yellow Cube - Limited',
        clickMessage: 'Yellow Cube - Snapshot Enabled',
        autoLookTarget: [3, 0.6, -15],
        color: '#ffd93d',
      },
    ],
    []
  )

  return (
    <Physics gravity={[0, -9.81, 0]}>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75}/>
        <color args={['#1a1a2e']} attach="background"/>

        <ambientLight intensity={0.8}/>
        <directionalLight position={[10, 10, 10]} intensity={0.8}/>

        <CharacterController/>
        <GroundPlane position={[0, 0, 0]} size={50}/>

        {Level(cubeConfigs, onMessageUpdate, material)}

        <GameplayController keybinds={keybinds} onSnapshotTaken={onSnapshotTaken}/>
    </Physics>
  )
}

