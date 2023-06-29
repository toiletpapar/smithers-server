import { Database } from '../src/database/Database'
import { script as crawlTargetScript } from './crawlTarget'
import { script as mangaUpdateScript } from './mangaUpdate'

let db: Database

const script = async () => {
  console.log('Started general seeding...')

  // fix any whitespace issues with set
  process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

  db = await Database.getInstance()

  const crawlTargets = await crawlTargetScript()

  const mangaUpdates = await mangaUpdateScript(crawlTargets)

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