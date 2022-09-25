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
  id: string;
  pieceId: string;
  team: Team;
  // both coordinates range 0-7 (an 8x8 chess board)
  x: number;
  y: number;
  // Technically, this could always be calculated from analyzing the full position history. However, stashing the value
  // on the move will be nice when: determining which pieces are in/out of play, showing move history in algebraic (chess)
  // notation (Bxe5 = Bishop captures square e5), and adding an undo/rollback feature since, like a purely functional approach,
  // the capture is reset when the move is filtered from the list. It is also more performant, though that will hardly
  // matter for a single game.
  capturedPieceId: string;
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
