import { Database } from '../src/database/Database'
import { CrawlTarget } from '../src/models/CrawlTarget'
import { script as crawlTargetScript } from './crawlTarget'
import { script as latestMangaUpdateScript } from './latestMangaUpdate'

let db: Database

const script = async () => {
  console.log('Started general seeding...')

  db = await Database.getInstance()

  const crawlTargets = await crawlTargetScript()

  const latestMangaUpdates = await latestMangaUpdateScript(crawlTargets)

  return
}

// GOOGLE_APPLICATION_CREDENTIALS=credentials/gcloud.json npx ts-node seed/seed.ts
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