import * as fs from 'fs';
import * as path from 'path';

// TODO: unsure if this will work the same way in production.
const configPath = path.resolve(__dirname, '../../../apps/caas-api/auth.json');

interface AuthConfig {
  mongoClusterURI: string;
}

export function getAuthVal(key: keyof AuthConfig): string {
  const config: AuthConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  return config[key];
}
