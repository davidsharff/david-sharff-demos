import { ReactElement, useState } from 'react';
import { useFetch } from 'usehooks-ts';
import { useParams } from 'react-router-dom';

import {
  AvailableMove,
  LiveGameState,
} from '@david-sharff-demos/static-caas-data';
import { Game } from './Game';
import {
  AvailableMovesForPiece,
  ClearAvailableMoves,
  GetAvailableMoves,
} from './types';

export function GameConnector(): ReactElement {
  const [availableMoveDetails, setAvailableMoveDetails] =
    useState<AvailableMovesForPiece | null>(null);
  const { gameId } = useParams<{ gameId: string }>();
  const { data, error } = useFetch<LiveGameState>(
    `/api/v1/game/state/${gameId}`
  );

  const handleGetAvailableMoves: GetAvailableMoves = async (pieceId) => {
    const r: Response = await fetch(`/api/v1/game/moves/${gameId}/${pieceId}`);

    const availableMoves: AvailableMove[] = await r.json();

    setAvailableMoveDetails({
      pieceId,
      availableMoves,
    });
  };

  const handleClearAvailableMoves: ClearAvailableMoves = () => {
    setAvailableMoveDetails(null);
  };

  return (
    <Game
      game={data}
      errorMsg={error?.message}
      onGetAvailableMoves={handleGetAvailableMoves}
      onClearAvailableMoves={handleClearAvailableMoves}
      availableMoveDetails={availableMoveDetails}
    />
  );
}
