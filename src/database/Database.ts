import { Pool, PoolClient, PoolConfig, QueryConfig, QueryResult, QueryResultRow } from 'pg'
import { SecretClient } from '../secrets/SecretClient'
import { Mutex } from 'async-mutex'

// Manage a single instance of a client in a pg pool
class DatabaseClient {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client
  }

  public query<T extends QueryResultRow>(query: string | QueryConfig): Promise<QueryResult<T>> {
    return this.client.query(query)
  }

  public release(): void {
    this.client.release()
  }
}

// Manage a single instance of a pool
class Database {
  private pool: Pool;
  private static db: Database | null = null;
  private static mutex = new Mutex()

  constructor(config: PoolConfig) {
    if (Database.db) {
      console.log('A database instance already exists...attempting to create new instance anyway')
    }

    this.pool = new Pool(config)
  }

  public static async getInstance(): Promise<Database> {
    if (!Database.db) {
      const client = await SecretClient.getInstance()
      const connectionString = await client.getSecret({secretName: 'local-psql'})

      if (!connectionString) {
        throw new Error('Unable to retrieve psql credentials')
      }

      const release = await Database.mutex.acquire()
      try {
        if (!Database.db) {
          Database.db = new Database({
            connectionString
          })
        }
      } finally {
        release();
      }
    }

    return Database.db
  }

  // Query any available client
  public query<T extends QueryResultRow>(query: string | QueryConfig): Promise<QueryResult<T>> {
    return this.pool.query(query)
  }

  // Get a client from the pool, remember to return it via client.release()
  public async getClient(): Promise<DatabaseClient> {
    return new DatabaseClient(await this.pool.connect())
  }

  // Used with other pgClient tools, prefer class methods instead
  public getPoolInstance(): Pool {
    return this.pool
  }

  public end(): Promise<void> {
    return this.pool.end()
  }
}

export {
  Database,
}