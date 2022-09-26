import { ReactElement } from 'react';
import { useFetch } from 'usehooks-ts';
import { useParams } from 'react-router-dom';

import { LiveGameState } from '@david-sharff-demos/static-caas-data';
import { Game } from './Game';

export function GameConnector(): ReactElement {
  const { gameId } = useParams<{ gameId: string }>();
  const { data, error } = useFetch<LiveGameState>(
    `/api/v1/game/state/${gameId}`
  );

  return <Game game={data} errorMsg={error?.message} />;
}
