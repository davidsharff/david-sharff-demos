// Note: if this project grew (i.e. not a demo) routes would be a folder and route files would be seperated by concern
//       with each route file being coupled to an endpoint prefix (e.g. /game, /user, etc.)
import { Express, Request } from 'express';
import {
  createGame,
  getGameState,
  getGameList,
  getAvailableMovesForGamePiece,
} from './services';
import {
  AvailableMove,
  GameRecord,
  LiveGameState,
} from '@david-sharff-demos/static-caas-data';

function _addBaseUrl(endPath: string): string {
  return `/api/v1/game/${endPath}`;
}

export function addApiRoutes(app: Express) {
  app.get(
    _addBaseUrl('state/:gameId'),
    async (req: Request<{ gameId: string }>, res) => {
      try {
        const { gameId } = req.params;
        const liveGameState: LiveGameState = await getGameState(gameId);

        res.json(liveGameState);
      } catch (e) {
        const msg = 'Could not get game state.';
        console.error(
          `${msg} Req params: ${JSON.stringify(req?.params)}:\n${e}`
        );
        res.status(500).send(msg);
      }
    }
  );

  app.get(_addBaseUrl('list'), async (req, res) => {
    try {
      const allGameRecords: GameRecord[] = await getGameList();

      res.json(allGameRecords);
    } catch (e) {
      const msg = 'Could not list all games.';
      console.error(`${msg} Req params: ${JSON.stringify(req?.params)}:\n${e}`);
      res.status(500).send(msg);
    }
  });

  app.get(
    _addBaseUrl('moves/:gameId/:pieceId'),
    async (req: Request<{ gameId: string; pieceId: string }>, res) => {
      try {
        const { gameId, pieceId } = req.params;
        const availableMoves: AvailableMove[] =
          await getAvailableMovesForGamePiece(gameId, pieceId);

        res.json(availableMoves);
      } catch (e) {
        const msg = 'Could not get available moves.';
        console.error(
          `${msg} Req params: ${JSON.stringify(req?.params)}:\n${e}`
        );
        res.status(500).send(msg);
      }
    }
  );

  app.post(_addBaseUrl('create'), async (req, res) => {
    try {
      const newGameState: LiveGameState = await createGame();

      res.json(newGameState);
    } catch (e) {
      const msg = 'Could not create new game.';
      console.error(`${msg}:\n${e}`);
      res.status(500).send(msg);
    }
  });
}
