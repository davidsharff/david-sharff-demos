import blackKing from './assets/blackKing.svg';
import blackQueen from './assets/blackQueen.svg';
import blackRook from './assets/blackRook.svg';
import blackKnight from './assets/blackKnight.svg';
import blackBishop from './assets/blackBishop.svg';
import blackPawn from './assets/blackPawn.svg';

import whiteKing from './assets/whiteKing.svg';
import whiteQueen from './assets/whiteQueen.svg';
import whiteRook from './assets/whiteRook.svg';
import whiteKnight from './assets/whiteKnight.svg';
import whiteBishop from './assets/whiteBishop.svg';
import whitePawn from './assets/whitePawn.svg';
import { PieceType, Team } from '@david-sharff-demos/static-caas-data';

export const pieceImageSrc: {
  [key in Team]: {
    [key in PieceType]: string;
  };
} = {
  [Team.Black]: {
    [PieceType.King]: blackKing,
    [PieceType.Queen]: blackQueen,
    [PieceType.Rook]: blackRook,
    [PieceType.Knight]: blackKnight,
    [PieceType.Bishop]: blackBishop,
    [PieceType.Pawn]: blackPawn,
  },
  [Team.White]: {
    [PieceType.King]: whiteKing,
    [PieceType.Queen]: whiteQueen,
    [PieceType.Rook]: whiteRook,
    [PieceType.Knight]: whiteKnight,
    [PieceType.Bishop]: whiteBishop,
    [PieceType.Pawn]: whitePawn,
  },
};
