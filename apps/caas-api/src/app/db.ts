import {
  GameRecordInput,
  GameRecord,
  PiecePosition,
} from '@david-sharff-demos/static-caas-data';
import { client } from './mongo';
import { ObjectId } from 'mongodb';

export async function insertGame(
  gameInput: GameRecordInput
): Promise<GameRecord> {
  const collection = await client.db('caas').collection('game');

  // TODO: when writing this logic originally I had thought I'd get the entire record back
  //       after inserting. I would consider a refactor now if there was more time.
  const result = await collection.insertOne(gameInput);
  return {
    id: result.insertedId.toString(),
    ...gameInput,
  };
}

export async function insertPiecePositionHistory(
  id: string,
  position: PiecePosition
): Promise<GameRecord> {
  const gameRecord = await getGameById(id);

  const collection = await client.db('caas').collection('game');

  await collection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        piecePositionHistory: [...gameRecord.piecePositionHistory, position],
      },
    }
  );

  // TODO: I don't like this extra query
  return await getGameById(id);
}

export async function getAllGames(): Promise<GameRecord[]> {
  const collection = await client.db('caas').collection('game');

  const documents = await collection.find().toArray();

  return _convertDocuments(documents);
}

export async function getGameById(id: string): Promise<GameRecord> {
  const collection = await client.db('caas').collection('game');

  const documents = await collection
    .find({
      _id: new ObjectId(id),
    })
    .toArray();

  return _convertDocuments(documents)[0];
}

function _convertDocuments(documents): GameRecord[] {
  return documents.map(({ _id, piecePositionHistory }) => ({
    id: _id.toString(),
    piecePositionHistory,
  }));
}
