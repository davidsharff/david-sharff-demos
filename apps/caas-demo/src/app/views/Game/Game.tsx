import { ReactElement } from 'react';
import { css } from '@emotion/react';

import CircularProgress from '@mui/material/CircularProgress';

import { LiveGameState, PieceType } from '@david-sharff-demos/static-caas-data';
import { ChessBoard } from '../../components/ChessBoard';
import {
  AvailableMovesForPiece,
  ClearAvailableMoves,
  GetAvailableMoves,
  OnMove,
} from './types';

interface GameProps {
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

const gameData = css`
  display: flex;
`;

export function Game(props: GameProps): ReactElement {
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
          <div css={gameData}>
            <ChessBoard
              gameState={game}
              onClickSquare={handleClickSquare}
              availableMoves={availableMoveDetails?.availableMoves}
              activePieceId={availableMoveDetails?.pieceId}
            />
            <CapturedPieces
              capturedWhitePieceTypes={game.capturedWhitePieceTypes}
              capturedBlackPieceTypes={game.capturedBlackPieceTypes}
            />
          </div>
        </>
      )}
    </div>
  );
}

interface CapturedPiecesProps {
  capturedWhitePieceTypes: PieceType[];
  capturedBlackPieceTypes: PieceType[];
}

const capturesMain = css`
  display: flex;
  flex: 0;
  margin-left: 20px;
  h4 {
    margin-top: 0;
  }
`;
const captureCol = css`
  display: flex;
  flex-direction: column;
  margin-right: 10px;
`;
function CapturedPieces({
  capturedWhitePieceTypes,
  capturedBlackPieceTypes,
}: CapturedPiecesProps): ReactElement {
  return (
    <div css={capturesMain}>
      <div css={captureCol}>
        <h4>White Captures</h4>
        {capturedWhitePieceTypes.map((pieceType, i) => (
          <div key={pieceType + i /* TODO: cleanup hack by adding pieceId*/}>
            {pieceType}
          </div>
        ))}
      </div>
      <div css={captureCol}>
        <h4>Black Captures</h4>
        {capturedBlackPieceTypes.map((pieceType, i) => (
          <div key={pieceType + i /* TODO: cleanup hack by adding pieceId*/}>
            {pieceType}
          </div>
        ))}
      </div>
    </div>
  );
}
