import { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetch } from 'usehooks-ts';

import {
  GameRecord,
  LiveGameState,
} from '@david-sharff-demos/static-caas-data';

import { Home } from './Home';

export function HomeConnector(): ReactElement {
  const { data, error } = useFetch<GameRecord[]>('/api/v1/game/list');
  const navigate = useNavigate();

  const handleCreateGame = async () => {
    const r: Response = await fetch('/api/v1/game/create', {
      method: 'POST',
    });

    const gameState: LiveGameState = await r.json();

    navigate(`/game/${gameState.id}`);
  };
  return (
    <Home
      allGames={data}
      errorMsg={error?.message}
      onCreateGame={handleCreateGame}
    />
  );
}
