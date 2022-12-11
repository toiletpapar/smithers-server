import express from 'express'
import { secretClient } from './secrets/SecretClient'

const app = express()
const port = 8080

// FIXME: set seems to add a trailing space?
process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

app.get('/test', (req, res) => {
  res.send('Hello World!')
})

app.get('/secret', async (req, res) => {
  try {
    const secret = await secretClient.getSecret('test-secret')
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