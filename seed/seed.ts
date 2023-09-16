import { script as crawlTargetScript } from './crawlTarget'
import { script as mangaUpdateScript } from './mangaUpdate'
import { script as usersScript } from './users'
import { script as logScript } from './log'
import seedConf from '../data/seed.json'
import userSeed from '../data/users.json'
import crawlerSeed from '../data/crawlers.json'
import { CrawlerTypes, Database, SecretClient } from '@ca-tyler/smithers-server-utils'

let db: Database

const script = async () => {
  console.log('Started general seeding...')

  // fix any whitespace issues with set
  process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

  db = await Database.getInstance()

  await logScript()
  const users = await usersScript({numRandomUsers: seedConf.NUM_RANDOM_USERS, additionalUsers: userSeed, shouldClear: true})
  const crawlTargets = await crawlTargetScript({
    users,
    additionalCrawlers: crawlerSeed.map((crawler) => {
    return {
      ...crawler,
      adapter: crawler.adapter as CrawlerTypes
    }})
  })
  const mangaUpdates = await mangaUpdateScript(crawlTargets)

  return
}

// GOOGLE_APPLICATION_CREDENTIALS=credentials/gcloud.json DB_SECRET_NAME=local-psql node ./build/seed/seed.js
script().then(() => {
  console.log('Successfully seeded')
}).catch((err) => {
  console.log('Failed to seed')
  console.log(err)
}).finally(async () => {
  console.log('Cleaning up seeding scripts...')

  if (db) {
    await db.end()
  }
})