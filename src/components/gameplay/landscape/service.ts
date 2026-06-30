import { HexagonalTableau, Kase2D } from '@services/game/labyrinth/tableau.ts';


export class KaseLandscape extends Kase2D {
    content?: string;
    scale: number
}


export function initTableauAndLab() {
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
    return tableau
}


export function initCubes() {
    return [
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
    ];
}
