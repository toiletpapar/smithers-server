import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { CrawlTarget, CrawlerTypes, SQLCrawlTarget } from '../src/models/CrawlTarget'
import seedConf from '../data/seed.json'

let db: Database

const DAY_IN_MILLIS = 1000*60*60*24

const script = async (): Promise<SQLCrawlTarget[]> => {
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
  await db.query(`
    CREATE TYPE crawler_types AS ENUM (
      'webtoon',
      'mangadex'
    );
  `)

  console.log('Creating table...')
  await db.query(`
    CREATE TABLE crawl_target (
      crawl_target_id INT GENERATED ALWAYS AS IDENTITY,
      name VARCHAR(100) UNIQUE NOT NULL,
      url TEXT NOT NULL,
      adapter crawler_types NOT NULL,
      last_crawled_on TIMESTAMPTZ,
      crawl_success BOOLEAN,
      PRIMARY KEY(crawl_target_id)
    );
  `)

  console.log('Inserting data...')
  const results = await Promise.all(Array.from({length: seedConf.NUM_CRAWL_TARGETS}).map(() => {
    const isCrawled = faker.datatype.boolean()

    return new CrawlTarget({
      name: faker.lorem.words(3),
      url: faker.internet.url(),
      adapter: (['webtoon', 'mangadex'] as CrawlerTypes[])[faker.datatype.number(1)],
      lastCrawledOn: isCrawled ? faker.datatype.datetime({min: Date.now() - DAY_IN_MILLIS*5, max: Date.now() + DAY_IN_MILLIS*5}) : null,
      crawlSuccess: isCrawled ? faker.datatype.boolean() : null
    }).insert()
  }))

  return results.map((result) => result.rows[0])
}

export { script }