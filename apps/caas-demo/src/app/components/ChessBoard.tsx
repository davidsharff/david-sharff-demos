import { ReactElement } from 'react';
import {
  AvailableMove,
  LiveGameState,
  PieceType,
  range,
} from '@david-sharff-demos/static-caas-data';

import { css } from '@emotion/react';
import { useTheme } from '@mui/material';

import { pieceImageSrc } from '../../constants';

interface Props {
  gameState: LiveGameState;
  onClickSquare: (x: number, y: number) => void;
  availableMoves?: AvailableMove[];
  activePieceId?: string;
}

const wrapperCss = css`
  flex: 1;
`;
const rowCss = css`
  display: flex;
`;

export function ChessBoard(props: Props): ReactElement {
  const { gameState, availableMoves, activePieceId } = props;
  const theme = useTheme();

  return (
    <div css={wrapperCss}>
      {range(8)
        .reverse()
        .map((y) => (
          <div key={y} css={rowCss}>
            {range(8).map((x) => {
              const isEvenX = x % 2 === 0;
              const isEvenY = y % 2 === 0;

              const backgroundColor = isEvenY
                ? isEvenX
                  ? theme.palette.grey['400']
                  : theme.palette.grey['50']
                : isEvenX
                ? theme.palette.grey['50']
                : theme.palette.grey['400'];

              const position = gameState.livePositions.find(
                (pos) => pos.x === x && pos.y === y
              );

              const isAvailableMove = availableMoves?.find(
                (move) => move.x === x && move.y === y
              );

              const isActivePieceId =
                position?.pieceId && position.pieceId === activePieceId;

              const showHighlight = isAvailableMove || isActivePieceId;
              const squareCss = css`
                border: solid #333 1px;
                flex: 1;
                text-align: center;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                background-color: ${showHighlight
                  ? theme.palette.primary.light
                  : backgroundColor};
                cursor: ${position?.pieceType === PieceType.Pawn ||
                isAvailableMove
                  ? 'pointer'
                  : 'default'};
              `;

              const breakPointValues = theme.breakpoints.values;
              const imgCss = css`
                width: 90px;
                height: 90px;
                @media (max-width: ${breakPointValues.lg}px) {
                  width: 75px;
                  height: 75px;
                }
                @media (max-width: ${breakPointValues.md}px) {
                  width: 60px;
                  height: 60px;
                }
                @media (max-width: ${breakPointValues.sm}px) {
                  width: 45px;
                  height: 45px;
                }
              `;

              return (
                <div
                  key={x}
                  css={squareCss}
                  onClick={() => props.onClickSquare(x, y)}
                >
                  {position ? (
                    <img
                      css={imgCss}
                      src={pieceImageSrc[position.team][position.pieceType]}
                      alt={`${position.team} ${position.pieceType}`}
                    />
                  ) : (
                    <img
                      css={imgCss}
                      style={{
                        content:
                          'url("data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==")',
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
}
