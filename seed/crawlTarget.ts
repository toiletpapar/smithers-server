import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { CrawlTarget, CrawlerTypes } from '../src/models/CrawlTarget'

let db: Database

const script = async () => {
  console.log('Starting crawlTarget seeding...')

  try {
    db = await Database.getInstance()

    await db.query(`
      DROP TABLE IF EXISTS crawl_target;
    `)

    await db.query(`
      DROP TYPE IF EXISTS crawler_types;
    `)

    await db.query(`
      CREATE TYPE crawler_types AS ENUM (
        'webtoon',
        'mangadex'
      );
    `)

    await db.query(`
      CREATE TABLE crawl_target (
        _id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        url TEXT NOT NULL,
        adapter crawler_types NOT NULL,
        lastCrawledOn TIMESTAMP,
        crawlSuccess BOOLEAN 
      );
    `)

    return Promise.all(Array.from({length: 20}).map(() => {
      return new CrawlTarget({
        name: faker.lorem.words(3),
        url: faker.internet.url(),
        adapter: (['webtoon', 'mangadex'] as CrawlerTypes[])[faker.datatype.number(1)],
        lastCrawledOn: faker.datatype.datetime(),
        crawlSuccess: faker.datatype.boolean()
      }).insert()
    }))
  } catch (err) {
    console.log('Something went horribly wrong...')
    console.log(err)
  }
}

// GOOGLE_APPLICATION_CREDENTIALS=credentials/gcloud.json npx ts-node seed/crawlTarget.ts
script().then(() => {
  console.log('Successfully seeded crawlTargets')
}).finally(async () => {
  console.log('Cleaning up crawlTarget script...')

  if (db) {
    await db.end()
  }
})