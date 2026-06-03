import React, { useRef, useState } from 'react';
import { LandscapeScene } from '../LandscapeScene.tsx';
import { Canvas } from '@react-three/fiber';
import type { Euler, Vector3 } from 'three';
import { LandscapeGamePlay } from './LandscapeGamePlay.tsx';

enum GameState {
    menu,
    initGame,
    game
}

export function LandscapeGame() {
    const [gameState, setGameState] = useState(GameState.menu)


    switch (gameState) {
        case GameState.menu:

            return <>

                <button onClick={()=>setGameState(GameState.initGame)}>start</button>
            </>


        case GameState.initGame:

        case GameState.game:

            return <><LandscapeGamePlay></LandscapeGamePlay>
            </>
    }


}
