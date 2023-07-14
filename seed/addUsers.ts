import { Database } from '../src/database/Database'
import { script as usersScript } from './users'
import userSeed from '../credentials/prodUsers.json'

let db: Database

const script = async () => {
  console.log('Started add users...')

  // fix any whitespace issues with set
  process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

  db = await Database.getInstance()

  const users = await usersScript({numRandomUsers: 0, additionalUsers: userSeed, shouldClear: false})

  return
}

// GOOGLE_APPLICATION_CREDENTIALS=credentials/gcloud.json DB_SECRET_NAME=local-psql npx ts-node seed/addUsers.ts
script().then(() => {
  console.log('Successfully seeded user accounts')
}).catch((err) => {
  console.log('Failed to seed')
  console.log(err)
}).finally(async () => {
  console.log('Cleaning up seeding scripts...')

  if (db) {
    await db.end()
  }
})