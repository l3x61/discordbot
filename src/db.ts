import Database from "better-sqlite3";
import path from "path";
import config from "./config.ts";

const dbPath = path.join(config.outputDir, config.dbFile);
const db = new Database(dbPath);

db.exec(`
    CREATE TABLE IF NOT EXISTS prefixes (
        userId TEXT,
        prefix TEXT NOT NULL,
        PRIMARY KEY(userId)
    );

    CREATE TABLE IF NOT EXISTS aliases (
        userId TEXT,
        alias TEXT NOT NULL,
        command TEXT,
        PRIMARY KEY(userId, alias)
    );
`);

export default db;
