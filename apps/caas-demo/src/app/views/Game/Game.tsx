import { ReactElement } from 'react';
import { css } from '@emotion/react';

import CircularProgress from '@mui/material/CircularProgress';

import { LiveGameState } from '@david-sharff-demos/static-caas-data';
import { ChessBoard } from '../../components/ChessBoard';
import {
  AvailableMovesForPiece,
  ClearAvailableMoves,
  GetAvailableMoves,
} from './types';

interface Props {
  game?: LiveGameState;
  errorMsg?: string;
  onGetAvailableMoves: GetAvailableMoves;
  onClearAvailableMoves: ClearAvailableMoves;
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

  const handleClickSquare: (pieceId?: string) => void = (pieceId) => {
    props.onClearAvailableMoves(); // Hack-ish but ensures clicking on any cell will wipe current selections if they exist.
    if (pieceId) {
      props.onGetAvailableMoves(pieceId);
    }
  };

  return (
    <div css={mainColCss}>
      <h2>Game ID {game.id}</h2>
      {props.errorMsg ? (
        <div>Error: {props.errorMsg}</div>
      ) : (
        <ChessBoard
          gameState={game}
          onClickSquare={handleClickSquare}
          availableMoves={availableMoveDetails?.availableMoves}
          activePieceId={availableMoveDetails?.pieceId}
        />
      )}
    </div>
  );
}
