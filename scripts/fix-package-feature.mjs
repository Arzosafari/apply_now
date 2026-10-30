import Database from 'better-sqlite3';
const db = new Database('data/faratech.db');
db.prepare("UPDATE packages SET featured = 0 WHERE slug = 'initial-consultation'").run();
console.log(db.prepare('SELECT slug, featured FROM packages ORDER BY sort_order').all());
