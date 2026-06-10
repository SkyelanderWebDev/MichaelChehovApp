import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { sql } from "drizzle-orm";
import * as schema from "@shared/schema";
import path from "path";
import fs from "fs";

// Ensure data directory exists
const dataDir = path.resolve(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "chekhov.db");
const sqlite = new Database(dbPath);

// Enable WAL mode for better concurrent read performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Auto-create tables on startup
db.run(sql`
  CREATE TABLE IF NOT EXISTS drawn_tools (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    category_name TEXT NOT NULL,
    parent_tool_name TEXT NOT NULL,
    child_tool_name TEXT,
    scale_value INTEGER,
    unveiled_value INTEGER,
    journal_entry TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL
  )
`);

db.run(sql`
  CREATE TABLE IF NOT EXISTS journal_entries (
    id TEXT PRIMARY KEY,
    drawn_tool_id TEXT NOT NULL,
    date TEXT NOT NULL,
    mode TEXT NOT NULL,
    practice_notes TEXT,
    observe_morning TEXT,
    observe_midday TEXT,
    observe_evening TEXT,
    apply_morning TEXT,
    apply_midday TEXT,
    apply_evening TEXT,
    journal_text TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);
