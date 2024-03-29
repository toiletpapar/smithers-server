import { faker } from '@faker-js/faker'
import { CrawlTarget, CrawlerTypes, ICrawlTarget, CrawlTargetRepository, Database } from '@ca-tyler/smithers-server-utils'
import seedConf from '../data/seed.json'
import { getSchemaSQL, removeRandomElements } from './utils'
import path from 'path'
import { User } from '../src/models/User'
import fixedUsersJson from '../data/users.json'

let db: Database

const DAY_IN_MILLIS = 1000*60*60*24

interface SeedCrawlTargetConfig {
  users: User[]
  additionalCrawlers: Omit<ICrawlTarget, "crawlTargetId" | "userId">[]
}

const script = async (config: SeedCrawlTargetConfig): Promise<CrawlTarget[]> => {
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
  await db.query(`
    DROP TYPE IF EXISTS image_types;
  `)

  console.log('Creating enums...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/002_crawler_types.sql')))
  await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/003_image_formats.sql')))

  console.log('Creating table...')
  await db.query(await getSchemaSQL(path.resolve(__dirname, '../../data/schema/004_crawl_target.sql')))

  console.log('Inserting data...')

  const fixedUsers = config.users.filter((el) => fixedUsersJson.some((fixedUser) => el.getObject().username === fixedUser.username))
  const randomUsers: User[] = removeRandomElements(
    config.users.filter((el) => fixedUsers.every((fixedUser) => el.getObject().username !== fixedUser.getObject().username)), // Remove fixed users
    Math.round(seedConf.NUM_RANDOM_USERS * seedConf.USERS_WITHOUT_CRAWL_TARGETS)  // Remove random non-fixed users
  ).concat(fixedUsers)  // Add back fixed users
  return Promise.all(Array.from({length: seedConf.NUM_CRAWL_TARGETS}).map(() => {
    const isCrawled = faker.datatype.boolean()
    const user = randomUsers[faker.datatype.number(randomUsers.length - 1)].getObject()

    return CrawlTargetRepository.insert(db, {
      name: faker.lorem.words(3),
      url: faker.internet.url(),
      adapter: (['webtoon', 'mangadex'] as CrawlerTypes[])[faker.datatype.number(1)],
      lastCrawledOn: isCrawled ? faker.datatype.datetime({min: Date.now() - DAY_IN_MILLIS*10, max: Date.now() + DAY_IN_MILLIS*10}) : null,
      crawlSuccess: isCrawled ? faker.datatype.boolean() : null,
      userId: user.userId,
      coverImage: null,
      coverFormat: null,
      coverSignature: null,
      favourite: faker.datatype.boolean()
    })
  }).concat(config.additionalCrawlers.map((crawler) => {
    const user = randomUsers[faker.datatype.number(randomUsers.length - 1)].getObject()

    return CrawlTargetRepository.insert(db, {
      ...crawler,
      userId: user.userId
    })
  })))
}

export { script }