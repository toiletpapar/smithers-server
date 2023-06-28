import express from 'express'
import path from 'path'
import { apiRouter } from './routes'
import { ImageClient } from './vision/Vision'
import passport from 'passport'
import { localStrategy } from './auth/local'
import { deserializeUser, serializeUser, getSessionMiddleware } from './auth/session'

const app = express()
const port = 8080

// fix any whitespace issues with set
process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

const initializeServer = async () => {
  app.use(express.json())
  app.use(express.static('demo'))

  passport.use(localStrategy)
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)
  app.use(await getSessionMiddleware())
  app.post('/login', passport.authenticate('local'), (req, res) => {
    res.sendStatus(200)
  })
  app.use(passport.authenticate('session'), (req, res, next) => {
    if (!req.user) {
      res.sendStatus(401)
    } else {
      next()
    }
  })

  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../demo/index.html'))
  })

  app.use('/api/v1', apiRouter)

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
}

initializeServer()