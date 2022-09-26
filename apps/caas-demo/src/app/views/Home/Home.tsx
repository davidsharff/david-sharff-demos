import { ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { css } from '@emotion/react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';

import { GameRecord } from '@david-sharff-demos/static-caas-data';

interface Props {
  allGames?: GameRecord[];
  errorMsg?: string;
  onCreateGame: () => void;
}
const mainColCss = css`
  display: flex;
  flex-direction: column;
`;

const gameItemCss = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  margin-bottom: 20px;
`;

const createButtonCss = css`
  width: 200px;
  font-size: 14px;
`;

export function Home(props: Props): ReactElement {
  if (!props.allGames) {
    return <CircularProgress />;
  }

  return (
    <div css={mainColCss}>
      <h2>All Games</h2>
      {props.errorMsg ? (
        <div>Error: {props.errorMsg}</div>
      ) : (
        props.allGames.map((gameRecord) => (
          <Paper key={gameRecord.id} css={gameItemCss}>
            <h4>Game ID: {gameRecord.id}</h4>
            <div>
              <Button
                variant="outlined"
                component={Link}
                to={`/game/${gameRecord.id}`}
                size="large"
              >
                View
              </Button>
            </div>
          </Paper>
        ))
      )}
      <Button
        css={createButtonCss}
        variant="contained"
        onClick={props.onCreateGame}
      >
        Create Game
      </Button>
    </div>
  );
}
