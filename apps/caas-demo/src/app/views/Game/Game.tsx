import { ReactElement } from 'react';
import { css } from '@emotion/react';

import CircularProgress from '@mui/material/CircularProgress';

import {
  LiveGameState,
  PieceType,
  Team,
} from '@david-sharff-demos/static-caas-data';
import { ChessBoard } from '../../components/ChessBoard';
import {
  AvailableMovesForPiece,
  ClearAvailableMoves,
  GetAvailableMoves,
  OnMove,
} from './types';
import { useTheme } from '@mui/material';
import { pieceImageSrc } from '../../../constants';

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

export function Game(props: GameProps): ReactElement {
  const { game, availableMoveDetails } = props;
  const theme = useTheme();

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

  const gameData = css`
    display: flex;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      flex-direction: column;
    }
  `;

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

function CapturedPieces({
  capturedWhitePieceTypes,
  capturedBlackPieceTypes,
}: CapturedPiecesProps): ReactElement {
  const theme = useTheme();

  const capturesMain = css`
    display: flex;
    flex: 0;
    margin-left: 20px;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      flex-direction: column;
      margin-top: 10px;
      margin-left: 0;
      width: 100%;
    }
    h4 {
      margin: 0;
    }
  `;

  const captureSection = css`
    display: flex;
    flex-direction: column;
    width: 120px;
    margin-right: 10px;
    @media (max-width: ${theme.breakpoints.values.md}px) {
      flex-direction: row;
      align-items: center;
      width: 100%;
    }
  `;

  const imageCss = css`
    height: 45px;
    width: 45px;
  `;

  return (
    <div css={capturesMain}>
      <div css={captureSection}>
        <h4>White Captures</h4>
        {capturedBlackPieceTypes.map((pieceType, i) => (
          <img
            css={imageCss}
            src={pieceImageSrc[Team.Black][pieceType]}
            alt={`${Team.Black} ${pieceType}`}
          />
        ))}
      </div>
      <div css={captureSection}>
        <h4>Black Captures</h4>
        {capturedWhitePieceTypes.map((pieceType, i) => (
          <img
            css={imageCss}
            src={pieceImageSrc[Team.White][pieceType]}
            alt={`${Team.White} ${pieceType}`}
          />
        ))}
      </div>
    </div>
  );
}
