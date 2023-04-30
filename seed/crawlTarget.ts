import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { CrawlTarget, CrawlerTypes, SQLCrawlTarget } from '../src/models/CrawlTarget'

let db: Database

const NUM_CRAWL_TARGETS = 20

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
      last_crawled_on TIMESTAMP,
      crawl_success BOOLEAN,
      PRIMARY KEY(crawl_target_id)
    );
  `)

  console.log('Inserting data...')
  const results = await Promise.all(Array.from({length: NUM_CRAWL_TARGETS}).map(() => {
    return new CrawlTarget({
      name: faker.lorem.words(3),
      url: faker.internet.url(),
      adapter: (['webtoon', 'mangadex'] as CrawlerTypes[])[faker.datatype.number(1)],
      lastCrawledOn: faker.datatype.boolean() ? faker.datatype.datetime() : null,
      crawlSuccess: faker.datatype.boolean() ? faker.datatype.boolean() : null
    }).insert()
  }))

  return results.map((result) => result.rows[0])
}

export { script }