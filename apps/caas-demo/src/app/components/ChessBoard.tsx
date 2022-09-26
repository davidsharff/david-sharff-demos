import {
  AvailableMove,
  LiveGameState,
  range,
} from '@david-sharff-demos/static-caas-data';
import { ReactElement } from 'react';
import { css } from '@emotion/react';

interface Props {
  gameState: LiveGameState;
  onClickSquare: (pieceId?: string) => void;
  availableMoves?: AvailableMove[];
  activePieceId?: string;
}

const rowCss = css`
  display: flex;
`;

export function ChessBoard(props: Props): ReactElement {
  const { gameState, availableMoves, activePieceId } = props;
  return (
    <div>
      {range(8)
        .reverse()
        .map((y) => (
          <div key={y} css={rowCss}>
            {range(8).map((x) => {
              const position = gameState.livePositions.find(
                (pos) => pos.x === x && pos.y === y
              );

              const isAvailableMove = availableMoves?.find(
                (move) => move.x === x && move.y === y
              );

              const isActivePieceId =
                position?.pieceId && position.pieceId === activePieceId;

              const squareCss = css`
                border: solid #333 1px;
                flex: 1;
                padding: 30px 5px;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background-color: ${isAvailableMove || isActivePieceId
                  ? '#f6f46a66'
                  : '#fff'};
              `;

              return (
                <div
                  key={x}
                  css={squareCss}
                  onClick={() => props.onClickSquare(position?.pieceId)}
                >
                  {position ? (
                    `${position.team[0]}: ${position.pieceId}`
                  ) : (
                    <span>&nbsp;</span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
