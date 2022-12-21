import { Pool, PoolConfig } from 'pg'
import { SecretClient } from '../secrets/SecretClient'

class Database {
  private pool: Pool;
  private static db: Promise<Database>;

  constructor(config: PoolConfig) {
    this.pool = new Pool(config)
  }

  public static getInstance(): Promise<Database> {
    if (!Database.db) {
      Database.db = SecretClient.getInstance().then((client) => {
        return client.getSecret({secretName: 'local-psql'})
      }).then((connectionString) => {
        if (!connectionString) {
          throw new Error('Unable to retrieve psql credentials')
        }

        return new Database({
          connectionString
        })
      })
    }

    return Database.db
  }

  // Query any available client
  public query(query: string) {
    return this.pool.query(query)
  }

  public end(): Promise<void> {
    return this.pool.end()
  }
}

export {
  Database,
}