import fs from 'node:fs';
import path from 'node:path';
import { db, nowIso } from './index';

const migrationsDir = path.resolve(process.cwd(), 'server/db/migrations');

db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (
  version TEXT PRIMARY KEY,
  applied_at TEXT NOT NULL
)`);

const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith('.sql'))
  .sort();

for (const file of files) {
  const exists = db.prepare('SELECT version FROM schema_migrations WHERE version = ?').get(file);
  if (exists) {
    console.log(`✓ migration ${file} already applied`);
    continue;
  }
  const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  const run = db.transaction(() => {
    db.exec(sql);
    db.prepare('INSERT INTO schema_migrations (version, applied_at) VALUES (?, ?)').run(file, nowIso());
  });
  run();
  console.log(`✓ applied migration ${file}`);
}

console.log('Database migrations complete.');
