// Note: if this project grew (i.e. not a demo) services would be a folder and service files would be seperated by
//       concern (e.g. gameService, userService, etc.)

import {
  AvailableMove,
  GameRecord,
  initialPositions,
  LiveGameState,
  PiecePosition,
  PieceType,
  Team,
} from '@david-sharff-demos/static-caas-data';
import {
  getAllGames,
  getGameById,
  insertGame,
  insertPiecePositionHistory,
} from './db';

export async function getGameList(): Promise<GameRecord[]> {
  return await getAllGames();
}

export async function getGameState(gameId: string): Promise<LiveGameState> {
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

  return uniquePieceIds.reduce((acc: PiecePosition[], pieceId) => {
    const isCaptured = piecePositionHistory.some(
      ({ capturedPieceId }) => capturedPieceId === pieceId
    );

    if (isCaptured) {
      return acc;
    }

    return [...acc, _calcCurrentPositionForPieceId(gameRecord, pieceId)];
  }, []);
}

export async function getAvailableMovesForGamePiece(
  gameId: string,
  pieceId: string
) {
  const gameRecord = await getGameById(gameId);

  return _calcMovesForPieceId(gameRecord, pieceId);
}

export function _calcMovesForPieceId(
  gameRecord: GameRecord,
  pieceId: string
): AvailableMove[] {
  // TODO: this should be an array of tuples.
  type MoveList = Array<{ x: number; y: number }>;

  const livePositions: PiecePosition[] = _calcLivePositions(gameRecord);

  const { piecePositionHistory } = gameRecord;
  const { team, pieceType, x, y } = livePositions.find(
    (p) => p.pieceId === pieceId
  );

  if (pieceType !== PieceType.Pawn) {
    throw new Error(`Unhandled piece type ${pieceType}`);
    // Putting in an else to represent this would eventually be in a switch or if/else block for each piece type.
  } else {
    const pieceMoveHistory = piecePositionHistory.filter(
      (p) => p.pieceId === pieceId
    );

    const oneStepAhead = team === Team.White ? 1 : -1;

    const nonCaptureMoves: MoveList = [
      { x, y: y + oneStepAhead },
      ...(pieceMoveHistory.length === 1
        ? [{ x, y: y + oneStepAhead * 2 }]
        : []),
    ].filter(
      (coordinates) =>
        // Ensure the space isn't occupied or in the way the initial two space move.
        !livePositions.find(
          (otherPiece) =>
            otherPiece.x === coordinates.x &&
            ((team === Team.White &&
              otherPiece.y > y &&
              otherPiece.y <= coordinates.y) ||
              (team === Team.Black &&
                otherPiece.y < y &&
                otherPiece.y >= coordinates.y))
        )
    );

    // Note: this does not handle the en passant move/capture
    const captureMoves: MoveList = livePositions
      .filter((p) => {
        return (
          p.team !== team && p.y === y + oneStepAhead && Math.abs(p.x - x) === 1
        );
      })
      .map((p) => ({
        x: p.x,
        y: p.y,
      }));

    return [...nonCaptureMoves, ...captureMoves].map((move) => ({
      ...move,
      capturedPieceId:
        livePositions.find((p) => p.x === move.x && p.y === move.y)?.pieceId ||
        null,
    }));
  }
}

// Built-in Array.prototype.findLast is not included in the project's TS es2015 target.
function _calcCurrentPositionForPieceId(gameRecord: GameRecord, pieceId) {
  return gameRecord.piecePositionHistory
    .filter((p) => p.pieceId === pieceId)
    .slice(-1)[0];
}

export async function moveGamePiece(
  gameId: string,
  pieceId: string,
  x: number,
  y: number
): Promise<LiveGameState> {
  const gameRecord = await getGameById(gameId);
  const activeTeam = _calcActiveTeam(gameRecord);
  const curPosition = _calcCurrentPositionForPieceId(gameRecord, pieceId);

  // TODO: revist error messages
  if (curPosition.team !== activeTeam) {
    throw new Error(`Invalid turn order: ${activeTeam} is next to act`);
  }

  if (curPosition.pieceType !== PieceType.Pawn) {
    throw new Error(`Unhandled piece type ${curPosition.pieceType}`);
  }

  const availableMoves = _calcMovesForPieceId(gameRecord, pieceId);

  if (!availableMoves.some((move) => move.x === x && move.y === y)) {
    throw new Error(`Invalid move`);
  }

  const updatedGameRecord = await insertPiecePositionHistory(gameId, {
    ...curPosition,
    x,
    y,
  });

  return _calcLiveGameState(updatedGameRecord);
}
