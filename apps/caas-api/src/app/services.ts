// Note: if this project grew (i.e. not a demo) services would be a folder and service files would be seperated by
//       concern (e.g. gameService, userService, etc.)

import {
  GameRecord,
  LiveGameState,
  Team,
} from '@david-sharff-demos/static-caas-data';
import { getAllGames, getGameById, insertGame } from './db';

export async function getGameList(): Promise<GameRecord[]> {
  return await getAllGames();
}

export async function getGameDetails(gameId: string): Promise<LiveGameState> {
  const gameRecord = await getGameById(gameId);

  return {
    id: gameRecord.id,
    activeTeam: Team.White,
    livePositions: [],
    capturedWhitePieceTypes: [],
    capturedBlackPieceTypes: [],
  };
}

export async function createGame(): Promise<GameRecord> {
  return await insertGame({
    piecePositionHistory: [],
  });
}
