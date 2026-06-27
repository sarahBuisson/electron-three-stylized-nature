import { useMemo, useState } from 'react'
import { Physics } from '@react-three/rapier'
import { PerspectiveCamera } from '@react-three/drei'
import { type Euler, ShaderMaterial, type Vector3 } from 'three'
import type { Keybinds } from '@models/Keybinds'
import { EffectComposer, Outline, Select, Selection } from '@react-three/postprocessing'
import { InteractiveCube } from './InteractiveCube'
import { GroundPlane } from './GroundPlane'
import { TableauToThreeContent } from '@components/gameplay/landscape/TableauToThreeContent.tsx';
import type { HexagonalTableau } from '@services/game/labyrinth/tableau.ts';
import { initCubes, initTableauAndLab, type KaseLandscape } from '@components/gameplay/landscape/service.ts';
import { FPSPlayer } from '@components/gameplay/controller/FPSPlayer.tsx';
import DrawingContent from '@components/gameplay/levels/drawing/DrawingContent.tsx';

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

  onSnapshotTaken,
  material,
  onMessageUpdate,
}: GameplaySceneContentProps) {
  const cubeConfigs: CubeConfig[] = useMemo(
    initCubes,
    []
  )


    const [tableau, setTableau] = useState<HexagonalTableau<KaseLandscape>>(()=>initTableauAndLab());
    const [pictureUrl, setPictureUrl] = useState<string>()
    const [solution, setSolution] = useState<{ position: Vector3, rotation: Euler }>()
  return (
    <Physics gravity={[0, -9.81, 0]}>
        <PerspectiveCamera makeDefault position={[0, 2, 5]} fov={75}/>
        <color args={['#1a1a2e']} attach="background"/>

        <ambientLight intensity={0.8}/>
        <directionalLight position={[10, 10, 10]} intensity={0.8}/>

        <GroundPlane position={[0, 0, 0]} size={50}/>

        {Level(cubeConfigs, onMessageUpdate, material)}

        <FPSPlayer></FPSPlayer>
        <DrawingContent></DrawingContent>
    </Physics>
  )
}

