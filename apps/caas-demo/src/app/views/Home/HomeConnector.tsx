import { Home } from './Home';
import { useFetch } from 'usehooks-ts';
import type { GameRecord } from '@david-sharff-demos/static-caas-data';

export function HomeConnector() {
  const { data, error } = useFetch<GameRecord[]>('/api/v1/game/list');
  return <Home allGames={data} errorMsg={error?.message} />;
}
