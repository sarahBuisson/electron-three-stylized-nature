import { Canvas } from '@react-three/fiber';
import { LandscapeScene } from '../LandscapeScene.tsx';
import React, { useEffect, useRef, useState } from 'react';
import { Euler, Vector3 } from 'three';
import { HexagonalTableau, Kase2D } from '../../../service/tableau.ts';

class KaseLandscape extends Kase2D {
    content?: string;
    scale: number
}

const invRec2 = 1 / Math.sqrt(2);
const invRec3 = 1 / Math.sqrt(3);
console.log("invRec2", invRec3)

function getPositionFromKase(kase: Kase2D): [number, number, number] {
    return [kase.x * 1.5, 0, (kase.x * 0.5 + kase.y) / invRec3]
}

export function LandscapeGamePlay() {


    function initTableauAndLab() {
        let kses: KaseLandscape[][] = [];
        for (let i = -10; i < 10; i++) {
            kses[i] = []
            for (let j = -10; j < 10; j++) {
                kses[i][j] = new KaseLandscape(i, j)
                kses[i][j].content = "zone"
                kses[i][j].scale = Math.random() * 3 + 1
            }
        }

        const tableau = new HexagonalTableau(kses)

        for (let i = 0; i < 10; i++) {
            tableau.getKase(i, i)!!.content = "water"
            tableau.getKase(i, 0)!!.content = "mountain"
            tableau.getKase(0, i)!!.content = "tree"
            tableau.getKase(9 - i, i)!!.content = "rock"
        }
        for (let i = 0; i < 10; i++) {

            tableau.randomKase().content = "tree"

            tableau.randomKase().content = "water"

            tableau.randomKase().content = "mountain"
            tableau.randomKase().content = "sand"
            tableau.randomKase().content = "grass"
        }

        tableau.neighbors(tableau.getKase(5, 5)!!).forEach((kase) => {
            kase.content = "purple"
        })
        return tableau
    }


    const [tableau, setTableau] = useState<HexagonalTableau<KaseLandscape>>(()=>initTableauAndLab());
    const [pictureUrl, setPictureUrl] = useState<string>()
    const [solution, setSolution] = useState<{ position: Vector3, rotation: Euler }>()
    let landscapeSceneRef = useRef<typeof LandscapeScene>(null)

    let initGame = () => {
        console.log("initGame")

        if(landscapeSceneRef.current) {
            console.log("initGame__")
            setSolution(landscapeSceneRef.current.moveToRandom())
            setPictureUrl(landscapeSceneRef.current.savePicture())
            console.log(pictureUrl)
            landscapeSceneRef.current.moveToRandom()
        }
    }
    useEffect(() => {
        initGame()
    }, [landscapeSceneRef.current]);

    return <><Canvas shadows>
        <LandscapeScene ref={landscapeSceneRef} tableau={tableau}/></Canvas>
        <div>inventory</div>
    </>;

}
