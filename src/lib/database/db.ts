import fs from 'fs';
import path from 'path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export interface DatabaseStatement {
  bind(...params: any[]): DatabaseStatement;
  all<T = any>(): Promise<{ results: T[]; success: boolean }>;
  run<T = any>(): Promise<{ success: boolean; meta?: any }>;
  first<T = any>(colName?: string): Promise<T | null>;
}

export interface DatabaseClient {
  prepare(query: string): DatabaseStatement;
  batch(statements: DatabaseStatement[]): Promise<any[]>;
  exec(sql: string): Promise<void>;
}

export function createMemoryDatabase(): DatabaseClient {
  const { DatabaseSync } = require('node:sqlite');
  const memDb = new DatabaseSync(':memory:');
  const migrationPath = path.resolve(process.cwd(), 'migrations/0001_initial_schema.sql');
  if (fs.existsSync(migrationPath)) {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    memDb.exec(sql);
  }
  return createNodeSqliteAdapter(memDb);
}

// In-memory or file-backed Node SQLite instance for local development / testing
let localNodeSqliteDb: any = null;

export function getDatabase(env?: any): DatabaseClient {
  // If running inside Cloudflare Worker with D1 binding
  if (env && env.DB && typeof env.DB.prepare === 'function') {
    return env.DB;
  }

  // Fallback to Node.js built-in SQLite
  if (!localNodeSqliteDb) {
    try {
      // Dynamic require so CF worker packager doesn't complain
      const { DatabaseSync } = require('node:sqlite');
      const dbPath = path.resolve(process.cwd(), 'launchpilot-local.sqlite');
      localNodeSqliteDb = new DatabaseSync(dbPath);

      // Read migration file and apply if needed
      const migrationPath = path.resolve(process.cwd(), 'migrations/0001_initial_schema.sql');
      if (fs.existsSync(migrationPath)) {
        const sql = fs.readFileSync(migrationPath, 'utf8');
        localNodeSqliteDb.exec(sql);
      }
    } catch (e) {
      console.warn('Failed to initialize local node:sqlite, falling back to memory database:', e);
      try {
        const { DatabaseSync } = require('node:sqlite');
        localNodeSqliteDb = new DatabaseSync(':memory:');
        const migrationPath = path.resolve(process.cwd(), 'migrations/0001_initial_schema.sql');
        if (fs.existsSync(migrationPath)) {
          const sql = fs.readFileSync(migrationPath, 'utf8');
          localNodeSqliteDb.exec(sql);
        }
      } catch (err2) {
        console.error('Fatal: Cannot initialize SQLite:', err2);
      }
    }
  }

  return createNodeSqliteAdapter(localNodeSqliteDb);
}

function createNodeSqliteAdapter(sqlite: any): DatabaseClient {
  return {
    prepare(query: string): DatabaseStatement {
      let boundParams: any[] = [];
      const stmt = sqlite.prepare(query);

      const statementWrapper: DatabaseStatement = {
        bind(...params: any[]): DatabaseStatement {
          boundParams = params.map(p => (p === undefined ? null : p));
          return statementWrapper;
        },
        async all<T = any>(): Promise<{ results: T[]; success: boolean }> {
          try {
            const rows = stmt.all(...boundParams);
            return { results: rows as T[], success: true };
          } catch (err) {
            console.error('SQLite query all() error:', err, 'Query:', query);
            throw err;
          }
        },
        async run<T = any>(): Promise<{ success: boolean; meta?: any }> {
          try {
            const info = stmt.run(...boundParams);
            return { success: true, meta: info };
          } catch (err) {
            console.error('SQLite query run() error:', err, 'Query:', query);
            throw err;
          }
        },
        async first<T = any>(colName?: string): Promise<T | null> {
          try {
            const row = stmt.get(...boundParams);
            if (!row) return null;
            if (colName) return (row as any)[colName] ?? null;
            return row as T;
          } catch (err) {
            console.error('SQLite query first() error:', err, 'Query:', query);
            throw err;
          }
        },
      };

      return statementWrapper;
    },

    async batch(statements: DatabaseStatement[]): Promise<any[]> {
      const results = [];
      for (const st of statements) {
        results.push(await st.run());
      }
      return results;
    },

    async exec(sql: string): Promise<void> {
      sqlite.exec(sql);
    },
  };
}
