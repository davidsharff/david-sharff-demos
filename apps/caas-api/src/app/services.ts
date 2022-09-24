// Note: if this project grew (i.e. not a demo) services would be a folder and service files would be seperated by
//       concern (e.g. gameService, userService, etc.)

import { Game, Team } from '@david-sharff-demos/static-caas-data';

export function getGameDetails(gameId: number): Game {
  return {
    id: gameId,
    activeTeam: Team.White,
  };
}

export function createGame(): Game {
  return {
    id: Math.round(Math.random() * 1000000),
    activeTeam: Team.Black,
  };
}
