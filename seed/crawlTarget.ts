import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { CrawlTarget, CrawlerTypes } from '../src/models/CrawlTarget'
import { CrawlTargetRepository } from '../src/repositories/CrawlTargetRepository'
import seedConf from '../data/seed.json'
import { getSchemaSQL } from './utils'
import path from 'path'

let db: Database

const DAY_IN_MILLIS = 1000*60*60*24

const script = async (): Promise<CrawlTarget[]> => {
  console.log('Starting crawlTarget seeding...')

  db = await Database.getInstance()

  console.log('Dropping table...')
  await db.query(`
    DROP TABLE IF EXISTS crawl_target CASCADE;
  `)

  console.log('Dropping enum...')
  await db.query(`
    DROP TYPE IF EXISTS crawler_types;
  `)

  console.log('Creating enum...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, './schema/crawler_types.sql')))

  console.log('Creating table...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, './schema/crawl_target.sql')))

  console.log('Inserting data...')
  return Promise.all(Array.from({length: seedConf.NUM_CRAWL_TARGETS}).map(() => {
    const isCrawled = faker.datatype.boolean()

    return CrawlTargetRepository.insert({
      name: faker.lorem.words(3),
      url: faker.internet.url(),
      adapter: (['webtoon', 'mangadex'] as CrawlerTypes[])[faker.datatype.number(1)],
      lastCrawledOn: isCrawled ? faker.datatype.datetime({min: Date.now() - DAY_IN_MILLIS*5, max: Date.now() + DAY_IN_MILLIS*5}) : null,
      crawlSuccess: isCrawled ? faker.datatype.boolean() : null
    })
  }))
}

export { script }