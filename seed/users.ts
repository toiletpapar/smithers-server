import { Database } from '@ca-tyler/smithers-server-utils'
import { faker } from '@faker-js/faker'
import { User } from '../src/models/User'
import { hash } from '../src/utils/hash'
import { UserRepository } from '../src/repositories/UserRepository'
import { getSchemaSQL } from './utils'
import path from 'path'

let db: Database

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
    await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/001_users.sql')))
  }
  
  console.log('Inserting data...')

  return Promise.all(Array.from({length: config.numRandomUsers}).map(async () => {
    const hashedPassword = await hash(faker.internet.password())

    return UserRepository.insert({
      username: faker.internet.userName(),
      passwordHash: hashedPassword,
      lockout: faker.datatype.boolean(),
    })
  }).concat(config.additionalUsers.map(async (user) => {
    const hashedPassword = await hash(user.password)

    return UserRepository.insert({
      ...user,
      passwordHash: hashedPassword
    })
  })))
}

export { script }