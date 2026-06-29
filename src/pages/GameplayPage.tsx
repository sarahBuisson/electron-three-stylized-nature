import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Euler, Vector2 } from 'three';
import { createTestTableau } from '@utils/mapGenerator';
import { MapToPlay, saveMapForPlay } from '@utils/mapPlayStorage';

export function GameplayPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const tableau = createTestTableau(10, 10);

    tableau.allKases().forEach((kase) => {
      if (kase.content === 'zone') {
        kase.content = 'grass';
      }
    });

    const playableKases = tableau.allKases().filter((kase) => kase.content === 'grass');
    const start = playableKases[0] ?? tableau.allKases()[0];
    const solution = playableKases[1] ?? start;

    saveMapForPlay(
      new MapToPlay(
        tableau,
        new Vector2(start.x, start.y),
        new Vector2(solution.x, solution.y),
        new Euler(0, Math.random() * Math.PI, 0),
        'geometric'
      )
    );

    navigate('/map-play', { replace: true });
  }, [navigate]);

  return <div>Initialisation de la map...</div>;
}
