import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Euler, Vector2 } from 'three';
import { createTestTableau } from '@utils/mapGenerator';
import { MapToPlay, saveMapForPlay } from '@utils/mapPlayStorage';

export function GameplayPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const tableau = createTestTableau(15, 15);

    const playableKases = tableau.allKases().filter((kase) => kase.content!= 'mountain'&&kase.content!= 'tree');
    const start = playableKases[Math.floor(playableKases.length*Math.random())] ||tableau.allKases()[0];
    const solution = playableKases[Math.floor(playableKases.length*Math.random())] || start;
console.log("start", start,(playableKases.length*Math.random()), "solution", solution,  playableKases.map(kase => kase.content));
    saveMapForPlay(
      new MapToPlay(
        tableau,
        new Vector2(start.x, start.y),
        new Vector2(solution.x, solution.y),
        new Euler(0, Math.random() * Math.PI, 0),
        'drawing'
      )
    );

    navigate('/map-play', { replace: true });
  }, [navigate]);

  return <div>Initialisation de la map...</div>;
}
