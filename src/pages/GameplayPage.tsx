import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Euler, Vector2 } from 'three';
import { createTestTableau } from '@utils/mapGenerator';
import { MapToPlay, saveMapForPlay } from '@utils/mapPlayStorage';
import { initTableauAndLab } from '@components/gameplay/landscape/service.ts';
import { findCentralSpawn } from '@components/gameplay/landscape/playerSpawn.ts';

export function GameplayPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const tableau = initTableauAndLab();

    const playableKases = tableau.allKases().filter((kase) => kase.content!= 'mountain'&&kase.content!= 'tree');
    const start = findCentralSpawn(tableau);
    if (!start) {
      setError('The map needs at least one tile without a tree or mountain to start playing.');
      return;
    }
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

  return error ? <div role="alert">{error}</div> : <div>Initialisation de la map...</div>;
}
