import Database from 'better-sqlite3';
import { config, ensureRuntimeDirectories } from '../config';

ensureRuntimeDirectories();

export const db = new Database(config.databasePath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('busy_timeout = 5000');
db.pragma('synchronous = NORMAL');

export type DbRow = Record<string, unknown>;

export function nowIso() {
  return new Date().toISOString();
}

export function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string' || !value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

export function json(value: unknown) {
  return JSON.stringify(value ?? []);
}

export function bool(value: unknown) {
  return value === 1 || value === true;
}
