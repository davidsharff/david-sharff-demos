// Note: if this project grew (i.e. not a demo) services would be a folder and service files would be seperated by
//       concern (e.g. gameService, userService, etc.)

import {
  GameRecord,
  LiveGameState,
  Team,
  initialPositions,
} from '@david-sharff-demos/static-caas-data';
import { getAllGames, getGameById, insertGame } from './db';

export async function getGameList(): Promise<GameRecord[]> {
  return await getAllGames();
}

export async function getGameDetails(gameId: string): Promise<LiveGameState> {
  const gameRecord = await getGameById(gameId);

  return _calcLiveGameState(gameRecord);
}

export async function createGame(): Promise<LiveGameState> {
  const gameRecord = await insertGame({
    piecePositionHistory: initialPositions,
  });

  return _calcLiveGameState(gameRecord);
}

function _calcLiveGameState(gameRecord: GameRecord): LiveGameState {
  return {
    id: gameRecord.id,
    activeTeam: Team.White,
    livePositions: [],
    capturedWhitePieceTypes: [],
    capturedBlackPieceTypes: [],
  };
}
