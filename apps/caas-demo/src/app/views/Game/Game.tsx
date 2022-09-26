import { ReactElement } from 'react';
import { css } from '@emotion/react';

import CircularProgress from '@mui/material/CircularProgress';

import { LiveGameState } from '@david-sharff-demos/static-caas-data';
import { ChessBoard } from '../../components/ChessBoard';
import {
  AvailableMovesForPiece,
  ClearAvailableMoves,
  GetAvailableMoves,
  OnMove,
} from './types';

interface Props {
  game: LiveGameState | null;
  errorMsg?: string;
  onGetAvailableMoves: GetAvailableMoves;
  onClearAvailableMoves: ClearAvailableMoves;
  onMove: OnMove;
  availableMoveDetails: AvailableMovesForPiece | null;
}
const mainColCss = css`
  display: flex;
  flex-direction: column;
`;

export function Game(props: Props): ReactElement {
  const { game, availableMoveDetails } = props;
  if (!game) {
    return <CircularProgress />;
  }

  const handleClickSquare: (x: number, y: number) => void = (x, y) => {
    const { pieceId: clickedPieceId } =
      game?.livePositions?.find((p) => p.x === x && p.y === y) || {};

    props.onClearAvailableMoves(); // Hack-ish but ensures clicking on any cell will wipe current selections if they exist.

    if (
      availableMoveDetails?.availableMoves?.find((m) => m.x === x && m.y === y)
    ) {
      props.onMove(availableMoveDetails?.pieceId, x, y);
    } else if (clickedPieceId) {
      props.onGetAvailableMoves(clickedPieceId);
    }
  };

  return (
    <div css={mainColCss}>
      <h2>Game ID {game.id}</h2>
      {props.errorMsg ? (
        <div>Error: {props.errorMsg}</div>
      ) : (
        <>
          <h4>Active Team: {game.activeTeam}</h4>
          <ChessBoard
            gameState={game}
            onClickSquare={handleClickSquare}
            availableMoves={availableMoveDetails?.availableMoves}
            activePieceId={availableMoveDetails?.pieceId}
          />
        </>
      )}
    </div>
  );
}
