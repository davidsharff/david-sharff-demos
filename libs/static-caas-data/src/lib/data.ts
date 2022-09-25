// TODO: breakout into three separate files (or libs): types, constants, and utils

// ***** Types *****
export interface GameRecordInput {
  piecePositionHistory: PiecePosition[];
  // Note: would contain playerIds, startTime, settings, etc. in the future.
}

export interface GameRecord extends GameRecordInput {
  id: string;
}

export enum Team {
  White = 'WHITE',
  Black = 'BLACK',
}

export enum PieceType {
  Pawn = 'PAWN',
  Knight = 'KNIGHT',
  Bishop = 'BISHOP',
  Rook = 'ROOK',
  Queen = 'QUEEN',
  King = 'KING',
}

export interface PiecePosition {
  pieceId: string;
  pieceType: PieceType;
  team: Team;
  // both coordinates range 0-7 (an 8x8 chess board)
  x: number;
  y: number;
  // Technically, this could always be calculated from analyzing the full position history. However, stashing the value
  // on the move will be nice when: determining which pieces are in/out of play, showing move history in algebraic (chess)
  // notation (Bxe5 = Bishop captures square e5), and adding an undo/rollback feature since, like a purely functional approach,
  // the capture is reset when the move is filtered from the list. It is also more performant, though that will hardly
  // matter for a single game.
  capturedPieceId: string | null;
}

// Note: I may not have implemented it this way if the project was _a chess app_ instead of _chess as a service_. A chess
//       app would have control of the front-end and could share code. In that case, I'd consider only sending down the
//       move history, and defining logic in a shared module accessible by the server and client (to be used for validation
//       and display respectively). For chess as a service, that arrangement does not exist, and it'd be a pretty poor
//       service if it handed back all the moves and said "here, now you figure it out".
export interface LiveGameState {
  id: string;
  activeTeam: Team;
  livePositions: PiecePosition[];
  capturedWhitePieceTypes: PieceType[];
  capturedBlackPieceTypes: PieceType[];
}

// ***** Constants *****
export const initialPositions: PiecePosition[] = [
  Team.White,
  Team.Black,
].reduce(
  (positions: PiecePosition[], team) => [
    ...positions,
    ..._createInitialPositionsForTeam(team),
  ],
  []
);

type InitialCoordinatesY = [0, 1] | [7, 6];
function _createInitialPositionsForTeam(team: Team): PiecePosition[] {
  const backLinePositions: PieceType[] = [
    PieceType.Rook,
    PieceType.Knight,
    PieceType.Bishop,
    PieceType.Queen,
    PieceType.King,
    PieceType.Bishop,
    PieceType.Knight,
    PieceType.Rook,
  ];

  const yCoordinates: InitialCoordinatesY =
    team === Team.White ? [0, 1] : [7, 6];

  const xCoordinates = range(8);
  return [
    ...xCoordinates.map((x) => {
      const y = yCoordinates[0];
      const pieceType = backLinePositions[x];
      return {
        pieceId: `${pieceType}-${x}-${y}`,
        pieceType,
        team,
        x,
        y,
        capturedPieceId: null,
      };
    }),
    ...xCoordinates.map((x) => {
      const y = yCoordinates[1];
      const pieceType = PieceType.Pawn;
      return {
        pieceId: `${pieceType}-${x}-${y}`,
        pieceType,
        team,
        x,
        y,
        capturedPieceId: null,
      };
    }),
  ];
}

// ***** Utils *****
// Zero-based, inclusive on bottom, exclusive on top
export function range(startVal: number, endVal?: number): Array<number> {
  // Subtract from start to handle optional end
  const arrayLength = Math.abs(startVal - (endVal || 0));

  // eslint-disable-next-line prefer-spread
  const emptyRangeArray = Array.apply(null, Array(arrayLength));

  return emptyRangeArray.map((ignored, i) => i + (endVal ? startVal : 0));
}
