import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { User } from '../src/models/User'
import * as argon2 from 'argon2'
import { UserRepository } from '../src/repositories/UserRepository'
import seedConf from '../data/seed.json'
import { getSchemaSQL } from './utils'
import path from 'path'

let db: Database

const DAY_IN_MILLIS = 1000*60*60*24

const script = async (): Promise<User[]> => {
  console.log('Starting user seeding...')

  db = await Database.getInstance()

  console.log('Dropping table...')
  await db.query(`
    DROP TABLE IF EXISTS users CASCADE;
  `)

  console.log('Creating table...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, './schema/001_users.sql')))

  console.log('Inserting data...')
  const additionalUsers = [
    {
      username: "admin1",
      password: "strongpassword",
      lockout: true,
    },
    {
      username: "admin2",
      password: "weakpassword",
      lockout: false,
    }
  ]

  return Promise.all(Array.from({length: seedConf.NUM_RANDOM_USERS}).map(async () => {
    const hash = await argon2.hash(faker.internet.password())

    return UserRepository.insert({
      username: faker.internet.userName(),
      passwordHash: hash,
      lockout: faker.datatype.boolean(),
    })
  }).concat(additionalUsers.map(async (user) => {
    const hash = await argon2.hash(user.password)

    return UserRepository.insert({
      ...user,
      passwordHash: hash
    })
  })))
}

export { script }