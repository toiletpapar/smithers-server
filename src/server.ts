import express from 'express'
import { SecretClient } from './secrets/SecretClient'
import { Database } from './database/db'

const app = express()
const port = 8080

// fix any whitespace issues with set
process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.get('/database', async (req, res) => {
  try {
    const db = await Database.getInstance()
    db.query('SELECT * FROM weather').then((value) => {
      res.json(value)
    })
  } catch (err) {
    res.sendStatus(500)
  }
})

app.get('/secret', async (req, res) => {
  try {
    const secretClient = await SecretClient.getInstance()
    const secret = await secretClient.getSecret({secretName: 'test-secret'})
    res.send(secret)
  } catch (err) {
    console.log(err)
    res.sendStatus(500)
  }
})

app.use('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(port, () => {
  console.log(`budget-server listening on port ${port}`)
})