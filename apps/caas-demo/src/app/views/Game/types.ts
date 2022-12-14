import { AvailableMove } from '@david-sharff-demos/static-caas-data';

export interface AvailableMovesForPiece {
  pieceId: string;
  availableMoves: AvailableMove[];
}

export type GetAvailableMoves = (pieceId: string) => Promise<void>;

export type ClearAvailableMoves = () => void;

export type OnMove = (pieceId: string, x: number, y: number) => void;
