import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { SQLLatestMangaUpdate, LatestMangaUpdate } from '../src/models/LatestMangaUpdate'
import { SQLCrawlTarget } from '../src/models/CrawlTarget'

let db: Database

const NUM_LATEST_MANGA_UPDATES = 100

const script = async (crawlTargets: SQLCrawlTarget[]): Promise<SQLLatestMangaUpdate[]> => {
  console.log('Starting latestMangaUpdate seeding...')

  if (crawlTargets.length === 0) {
    throw new Error('At least one crawl target must exist for latestMangUpdate to populate')
  }

  db = await Database.getInstance()

  console.log('Dropping table...')
  await db.query(`
    DROP TABLE IF EXISTS latest_manga_update;
  `)

  console.log('Creating table...')
  await db.query(`
    CREATE TABLE latest_manga_update (
      latest_manga_update_id INT GENERATED ALWAYS AS IDENTITY,
      crawl_target_id INT NOT NULL,
      crawled_on TIMESTAMPTZ NOT NULL,
      chapter SMALLINT NOT NULL,
      chapter_name TEXT,
      is_read BOOLEAN NOT NULL,
      read_at TEXT NOT NULL,
      PRIMARY KEY(latest_manga_update_id),
      CONSTRAINT fk_crawl_target
        FOREIGN KEY(crawl_target_id)
          REFERENCES crawl_target(crawl_target_id)
          ON DELETE CASCADE
    );
  `)

  console.log('Inserting data...')
  const results = await Promise.all(Array.from({length: NUM_LATEST_MANGA_UPDATES}).map(() => {
    const crawlTarget = crawlTargets[faker.datatype.number(crawlTargets.length - 1)]

    if (!crawlTarget.crawl_target_id) {
      throw new Error('crawlTarget does not have a primary key')
    }

    return new LatestMangaUpdate({
      crawlId: crawlTarget.crawl_target_id,
      crawledOn: faker.datatype.datetime(),
      chapter: faker.datatype.number(32766),
      chapterName: faker.datatype.boolean() ? faker.lorem.words(5) : null,
      isRead: faker.datatype.boolean(),
      readAt: faker.internet.url()
    }).insert()
  }))

  return results.map((result) => result.rows[0])
}

export { script }