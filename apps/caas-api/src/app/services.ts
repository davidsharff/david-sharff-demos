// Note: if this project grew (i.e. not a demo) services would be a folder and service files would be seperated by
//       concern (e.g. gameService, userService, etc.)

import {
  GameRecord,
  initialPositions,
  LiveGameState,
  PiecePosition,
  PieceType,
  Team,
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

// Overall this function makes more passes over the data than necessary, but I wouldn't add complexity or reduce readability
// for a well constrained data set that would only have performance issues unless someone used the game for essentially
// a DDoS attack.
function _calcLiveGameState(gameRecord: GameRecord): LiveGameState {
  const activeTeam = _calcActiveTeam(gameRecord);

  const livePositions = _calcLivePositions(gameRecord);

  const capturedWhitePieceTypes = _calcCapturedPiecesForTeam(
    gameRecord,
    Team.White
  );

  const capturedBlackPieceTypes = _calcCapturedPiecesForTeam(
    gameRecord,
    Team.Black
  );

  return {
    id: gameRecord.id,
    activeTeam,
    livePositions,
    capturedWhitePieceTypes,
    capturedBlackPieceTypes,
  };
}

function _calcActiveTeam(gameRecord: GameRecord): Team {
  return gameRecord.piecePositionHistory.slice(-1)[0].team === Team.White
    ? Team.Black
    : Team.White;
}

function _calcCapturedPiecesForTeam(
  gameRecord: GameRecord,
  team: Team
): Array<PieceType> {
  return gameRecord.piecePositionHistory
    .filter((p) => p.team !== team && !!p.capturedPieceId)
    .map(({ pieceType }) => pieceType);
}

function _calcLivePositions(gameRecord: GameRecord): PiecePosition[] {
  const { piecePositionHistory } = gameRecord;
  // Set guarantees unique entries though I don't love this approach:
  //   1. It may look mysterious to the uninitiated
  //   2. Piece Ids are static and wouldn't have to be calculated if they were defined as constants
  //
  const uniquePieceIds = Array.from(
    new Set(piecePositionHistory.map(({ pieceId }) => pieceId))
  );

  // Built-in Array.prototype.findLast is not included in the project's TS es2015 target
  // Slice to avoid mutating the OG array.
  const reversePosHistory = piecePositionHistory.slice().reverse();

  return uniquePieceIds.reduce((acc: PiecePosition[], pieceId) => {
    const isCaptured = piecePositionHistory.some(
      ({ capturedPieceId }) => capturedPieceId === pieceId
    );
    if (isCaptured) {
      return acc;
    }

    return [...acc, reversePosHistory.find((p) => p.pieceId === pieceId)];
  }, []);
}
