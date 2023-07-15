import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { User } from '../src/models/User'
import * as argon2 from 'argon2'
import { UserRepository } from '../src/repositories/UserRepository'
import { getSchemaSQL } from './utils'
import path from 'path'

let db: Database

const DAY_IN_MILLIS = 1000*60*60*24

interface SeedUser {
  username: string,
  password: string,
  lockout: boolean,
}

interface SeedUserConfig {
  numRandomUsers: number
  additionalUsers: SeedUser[]
  shouldClear: boolean  // Clears the existing table if it exists
}

const script = async (config: SeedUserConfig): Promise<User[]> => {
  console.log('Starting user seeding...')

  db = await Database.getInstance()

  if (config.shouldClear) {
    console.log('Dropping table...')
    await db.query(`
      DROP TABLE IF EXISTS users CASCADE;
    `)

    console.log('Creating table...')
    await db.query(await getSchemaSQL(path.resolve(__dirname, './schema/001_users.sql')))
  }
  
  console.log('Inserting data...')

  return Promise.all(Array.from({length: config.numRandomUsers}).map(async () => {
    const hash = await argon2.hash(faker.internet.password(), {memoryCost: 32768, parallelism: 2})

    return UserRepository.insert({
      username: faker.internet.userName(),
      passwordHash: hash,
      lockout: faker.datatype.boolean(),
    })
  }).concat(config.additionalUsers.map(async (user) => {
    const hash = await argon2.hash(user.password)

    return UserRepository.insert({
      ...user,
      passwordHash: hash
    })
  })))
}

export { script }