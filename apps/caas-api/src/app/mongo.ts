import { MongoClient, ServerApiVersion } from 'mongodb';
import { getAuthVal } from '../utils';

export const client = new MongoClient(getAuthVal('mongoClusterURI'), {
  // TODO: clean this up later.
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
