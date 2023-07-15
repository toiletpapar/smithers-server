import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { User } from '../src/models/User'
import { hash } from '../src/utils/hash'
import { UserRepository } from '../src/repositories/UserRepository'
import { getSchemaSQL } from './utils'
import path from 'path'

// let db: Database

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

const script = async (config: SeedUserConfig): Promise<void[]> => {
  console.log('Starting user seeding...')

  // db = await Database.getInstance()

  // if (config.shouldClear) {
  //   console.log('Dropping table...')
  //   await db.query(`
  //     DROP TABLE IF EXISTS users CASCADE;
  //   `)

  //   console.log('Creating table...')
  //   await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/001_users.sql')))
  // }
  
  console.log('Inserting data...')

  return Promise.all(Array.from({length: config.numRandomUsers}).map(async () => {
    const hashedPassword = await hash(faker.internet.password())

    console.log(hashedPassword)

    // return UserRepository.insert({
    //   username: faker.internet.userName(),
    //   passwordHash: hashedPassword,
    //   lockout: faker.datatype.boolean(),
    // })
  }).concat(config.additionalUsers.map(async (user) => {
    const hashedPassword = await hash(user.password)

    console.log(hashedPassword)

    // return UserRepository.insert({
    //   ...user,
    //   passwordHash: hashedPassword
    // })
  })))
}

export { script }