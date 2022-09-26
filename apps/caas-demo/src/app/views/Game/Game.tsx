import { ReactElement } from 'react';
import { css } from '@emotion/react';

import CircularProgress from '@mui/material/CircularProgress';

import { LiveGameState } from '@david-sharff-demos/static-caas-data';
import { ChessBoard } from '../../components/ChessBoard';

interface Props {
  game?: LiveGameState;
  errorMsg?: string;
}
const mainColCss = css`
  display: flex;
  flex-direction: column;
`;

export function Game(props: Props): ReactElement {
  const { game } = props;
  if (!game) {
    return <CircularProgress />;
  }

  return (
    <div css={mainColCss}>
      <h2>Game ID {game.id}</h2>
      {props.errorMsg ? (
        <div>Error: {props.errorMsg}</div>
      ) : (
        <ChessBoard gameState={game} />
      )}
    </div>
  );
}
