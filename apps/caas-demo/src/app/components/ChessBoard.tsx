import { LiveGameState, range } from '@david-sharff-demos/static-caas-data';
import { ReactElement } from 'react';
import { css } from '@emotion/react';

interface Props {
  gameState: LiveGameState;
}

const rowCss = css`
  display: flex;
`;

const squareCss = css`
  border: solid #333 1px;
  flex: 1;
  padding: 30px 5px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export function ChessBoard(props: Props): ReactElement {
  const { gameState } = props;
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

              return (
                <div
                  key={x}
                  css={squareCss}
                  // onClick={() =>
                  //   position?.pieceId && handleGetMoves(position?.pieceId)
                  // }
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
