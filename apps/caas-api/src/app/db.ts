import { promises as fs, existsSync, writeFileSync } from 'fs';
import * as path from 'path';
import {
  GameRecordInput,
  GameRecord,
  PiecePosition,
} from '@david-sharff-demos/static-caas-data';

interface JsonDb {
  games: GameRecord[];
}

// TODO: not sure if this will work outside dev mode (first time using Nx). The json "db" is temporary in any case.
const jsonDbPath = path.resolve(
  __dirname,
  '../../../apps/caas-api/chessData.json'
);

if (!existsSync(jsonDbPath)) {
  writeFileSync(
    jsonDbPath,
    JSON.stringify({
      games: [],
    })
  );
}

export async function insertGame(
  gameInput: GameRecordInput
): Promise<GameRecord> {
  const jsonDb = await _loadJsonDb();
  const game: GameRecord = { id: _generateId(), ...gameInput };

  const updatedDb: JsonDb = {
    ...jsonDb,
    games: [...jsonDb.games, game],
  };

  await _saveJsonDb(updatedDb);

  return game;
}

export async function insertPiecePositionHistory(
  id: string,
  position: PiecePosition
): Promise<GameRecord> {
  const gameRecord = await getGameById(id);
  const updatedGame = {
    ...gameRecord,
    piecePositionHistory: [...gameRecord.piecePositionHistory, position],
  };

  const jsonDb = await _loadJsonDb();

  const updatedDb: JsonDb = {
    ...jsonDb,
    games: jsonDb.games.map((game) => (game.id === id ? updatedGame : game)),
  };

  await _saveJsonDb(updatedDb);

  return updatedGame;
}

export async function getAllGames(): Promise<GameRecord[]> {
  const jsonDb = await _loadJsonDb();
  return jsonDb.games;
}

export async function getGameById(id: string): Promise<GameRecord> {
  const jsonDb = await _loadJsonDb();

  return jsonDb.games.find((g) => g.id === id);
}

// Assessment asks for Mongo which by default would require a custom type for primary keys from their lib.
// Using a string id as a facsimile for now.
function _generateId(): string {
  return Math.round(Math.random() * 10000000) + '';
}

async function _loadJsonDb(): Promise<JsonDb> {
  const fileData = await fs.readFile(jsonDbPath, 'utf8');
  return JSON.parse(fileData);
}

async function _saveJsonDb(jsonDb: JsonDb): Promise<void> {
  await fs.writeFile(jsonDbPath, JSON.stringify(jsonDb));
}
