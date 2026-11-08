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

function applyMigrations(sqlite: any): void {
  try {
    const migrationsDir = path.resolve(process.cwd(), 'migrations');
    if (fs.existsSync(migrationsDir)) {
      const files = fs.readdirSync(migrationsDir)
        .filter((f: string) => f.endsWith('.sql'))
        .sort();
      for (const file of files) {
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
        sqlite.exec(sql);
      }
    }
  } catch (err) {
    console.warn('Warning applying migrations to SQLite:', err);
  }
}

export function createMemoryDatabase(): DatabaseClient {
  const { DatabaseSync } = require('node:sqlite');
  const memDb = new DatabaseSync(':memory:');
  applyMigrations(memDb);
  return createNodeSqliteAdapter(memDb);
}

// In-memory or file-backed Node SQLite instance for local development / testing
let localNodeSqliteDb: any = null;
let testMemoryDb: DatabaseClient | null = null;

export function getDatabase(env?: any): DatabaseClient {
  // If running inside Cloudflare Worker with D1 binding
  if (env && env.DB && typeof env.DB.prepare === 'function') {
    return env.DB;
  }

  // In test environments, reuse a single test memory database per process
  if (process.env.NODE_ENV === 'test' || process.env.VITEST) {
    if (!testMemoryDb) {
      testMemoryDb = createMemoryDatabase();
    }
    return testMemoryDb;
  }

  // Fallback to Node.js built-in SQLite
  if (!localNodeSqliteDb) {
    try {
      // Dynamic require so CF worker packager doesn't complain
      const { DatabaseSync } = require('node:sqlite');
      const dbPath = path.resolve(process.cwd(), 'launchpilot-local.sqlite');
      localNodeSqliteDb = new DatabaseSync(dbPath);
      applyMigrations(localNodeSqliteDb);
    } catch (e) {
      console.warn('Failed to initialize local node:sqlite, falling back to memory database:', e);
      try {
        const { DatabaseSync } = require('node:sqlite');
        localNodeSqliteDb = new DatabaseSync(':memory:');
        applyMigrations(localNodeSqliteDb);
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
