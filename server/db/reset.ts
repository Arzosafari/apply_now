import fs from 'node:fs';
import { config } from '../config';

if (config.isProduction) {
  throw new Error('Refusing to reset the database in production.');
}

for (const suffix of ['', '-shm', '-wal']) {
  const file = `${config.databasePath}${suffix}`;
  if (fs.existsSync(file)) fs.rmSync(file);
}
console.log('Local development database removed.');
