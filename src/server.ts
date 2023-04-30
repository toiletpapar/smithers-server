import express from 'express'
import path from 'path'
import { ImageClient } from './vision/Vision'

const app = express()
const port = 8080

// fix any whitespace issues with set
process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

app.use(express.static('demo'))

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../demo/index.html'))
})

app.post('/vision', async (req, res) => {
  try {
    let buf: Buffer

    // FIXME: Read the file into memory, unbounded
    req.on('data', (chunk) => {
      if (buf) {
        buf = Buffer.concat([buf, chunk])
      } else {
        buf = chunk
      }
    })

    req.on('end', async () => {
      console.log('done reading')

      try {
        const imageClient = await ImageClient.getInstance()
        const response = await imageClient.textDetection(buf.toString('base64'))
        res.json(response)
      } catch (err) {
        console.log(err)
        res.sendStatus(500)
      }
    })

    req.on('error', (err) => {
      console.log(err)
      res.sendStatus(500)
    })
  } catch (err) {
    res.sendStatus(500)
  }
})

app.use('*', (req, res) => {
  res.sendStatus(404)
})

app.listen(port, () => {
  console.log(`budget-server listening on port ${port}`)
})