// Note: if this project grew (i.e. not a demo) routes would be a folder and route files would be seperated by concern
//       with each route file being coupled to an endpoint prefix (e.g. /game, /user, etc.)
import { Express, Request } from 'express';
import { createGame, getGameDetails } from './services';

const routePrefix = '/api/game';

export function addApiRoutes(app: Express) {
  // TODO: consider extending express' Request type for req params and req body (ex. Request<{ gameId: string }>).
  app.get(`${routePrefix}/:gameId`, (req: Request<{ gameId: string }>, res) => {
    try {
      const { gameId } = req.params;
      const gameDetails = getGameDetails(parseInt(gameId));
      res.json(gameDetails);
    } catch (e) {
      const msg = 'Could not get game details.';
      console.error(`${msg} Req params: ${JSON.stringify(req?.params)}:\n${e}`);
      res.status(500).send(msg);
    }
  });

  app.post(`${routePrefix}/create`, (req, res) => {
    try {
      const newGameDetails = createGame();
      res.json(newGameDetails);
    } catch (e) {
      const msg = 'Could not create new game.';
      console.error(`${msg}:\n${e}`);
      res.status(500).send(msg);
    }
  });
}
