import { Database, Log, LogRepository, LogTypes } from '@ca-tyler/smithers-server-utils'
import { getSchemaSQL } from './utils'
import path from 'path'
import seedConf from '../data/seed.json'
import { faker } from '@faker-js/faker'

let db: Database

const DAY_IN_MILLIS = 1000*60*60*24
const script = async (): Promise<Log[]> => {
  console.log('Starting logs seeding...')

  db = await Database.getInstance()

  console.log('Dropping table...')
  await db.query(`
    DROP TABLE IF EXISTS logs CASCADE;
  `)

  console.log('Dropping enum...')
  await db.query(`
    DROP TYPE IF EXISTS log_types;
  `)

  console.log('Creating enums...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/006_log_types.sql')))

  console.log('Creating table...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/007_log.sql')))

  console.log('Inserting data...')
  return Promise.all(Array.from({length: seedConf.NUM_RANDOM_LOGS}).map(() => {
    return LogRepository.insert(db, {
      logType: ([
        'SMITHERS_SERVER_DEBUG',
        'SMITHERS_SERVER_INFO',
        'SMITHERS_SERVER_WARN',
        'SMITHERS_SERVER_ERROR',
        'SMITHERS_SERVER_FATAL',
        'SMITHERS_CRAWLER_DEBUG',
        'SMITHERS_CRAWLER_INFO',
        'SMITHERS_CRAWLER_WARN',
        'SMITHERS_CRAWLER_ERROR',
        'SMITHERS_CRAWLER_FATAL'
      ] as LogTypes[])[faker.datatype.number(9)],
      explanation: faker.lorem.words(3),
      info: {
        someString: faker.lorem.words(3),
        someNumber: faker.datatype.number(5)
      },
      loggedOn: faker.datatype.datetime({min: Date.now() - DAY_IN_MILLIS*10, max: Date.now() + DAY_IN_MILLIS*10})
    })
  }))
}

export { script }