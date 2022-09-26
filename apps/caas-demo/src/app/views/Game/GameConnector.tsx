import { ReactElement, useEffect, useState } from 'react';
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
  OnMove,
} from './types';

export function GameConnector(): ReactElement {
  const [gameState, setGameState] = useState<LiveGameState | null>(null);
  const [availableMoveDetails, setAvailableMoveDetails] =
    useState<AvailableMovesForPiece | null>(null);

  const { gameId } = useParams<{ gameId: string }>();

  const { data, error } = useFetch<LiveGameState>(
    `/api/v1/game/state/${gameId}`
  );

  useEffect(() => {
    if (gameState === null && data) {
      setGameState(data);
    }
  }, [gameState, data]);

  const handleGetAvailableMoves: GetAvailableMoves = async (pieceId) => {
    const r: Response = await fetch(
      `/api/v1/game/piece/moves/${gameId}/${pieceId}`
    );

    const availableMoves: AvailableMove[] = await r.json();

    setAvailableMoveDetails({
      pieceId,
      availableMoves,
    });
  };

  const handleClearAvailableMoves: ClearAvailableMoves = () => {
    setAvailableMoveDetails(null);
  };

  const handleMove: OnMove = async (pieceId, x, y) => {
    const r: Response = await fetch(`/api/v1/game/piece/move`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        gameId,
        pieceId,
        x,
        y,
      }),
    });

    const newGameState: LiveGameState = await r.json();

    setGameState(newGameState);
  };

  return (
    <Game
      game={gameState}
      errorMsg={error?.message}
      onGetAvailableMoves={handleGetAvailableMoves}
      onClearAvailableMoves={handleClearAvailableMoves}
      availableMoveDetails={availableMoveDetails}
      onMove={handleMove}
    />
  );
}
