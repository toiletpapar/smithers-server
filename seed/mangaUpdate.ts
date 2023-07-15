import { Database } from '../src/database/Database'
import { faker } from '@faker-js/faker'
import { MangaUpdate } from '../src/models/MangaUpdate'
import { CrawlTarget } from '../src/models/CrawlTarget'
import { MangaUpdateRepository } from '../src/repositories/MangaUpdateRepository'
import seedConf from '../data/seed.json'
import { getSchemaSQL, removeRandomElements } from './utils'
import path from 'path'

let db: Database

const script = async (crawlTargets: CrawlTarget[]): Promise<MangaUpdate[]> => {
  console.log('Starting mangaUpdate seeding...')

  if (crawlTargets.length === 0) {
    throw new Error('At least one crawl target must exist for mangaUpdate to populate')
  }

  db = await Database.getInstance()

  console.log('Dropping table...')
  await db.query(`
    DROP TABLE IF EXISTS manga_update;
  `)

  console.log('Creating table...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/004_manga_update.sql')))

  console.log('Inserting data...')
  const randomCrawlTargets: CrawlTarget[] = removeRandomElements(crawlTargets, Math.round(seedConf.NUM_CRAWL_TARGETS * seedConf.CRAWL_TARGETS_WITHOUT_UPDATES))
  return await Promise.all(Array.from({length: seedConf.NUM_MANGA_UPDATES}).map(() => {
    const crawlTarget = randomCrawlTargets[faker.datatype.number(randomCrawlTargets.length - 1)].getObject()

    return MangaUpdateRepository.insert({
      crawlId: crawlTarget.crawlTargetId,
      crawledOn: faker.datatype.datetime(),
      chapter: faker.datatype.number(32766),
      chapterName: faker.datatype.boolean() ? faker.lorem.words(5) : null,
      isRead: faker.datatype.boolean(),
      readAt: faker.internet.url()
    })
  }))
}

export { script }