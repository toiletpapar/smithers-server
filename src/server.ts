import express from 'express'
import path from 'path'
import { apiRouter } from './routes'
import { ImageClient } from './vision/Vision'
import passport from 'passport'
import { localStrategy } from './services/auth/local'
import { deserializeUser, serializeUser, getSessionMiddleware, SessionInfo } from './services/auth/session'
import { AuthUser } from './models/AuthUser'
import { ValidationError } from 'yup'
import crypto from 'crypto'
import { Database, LogRepository, LogTypes } from '@ca-tyler/smithers-server-utils'

const app = express()
const port = 8080

// fix any whitespace issues with set
process.env.GOOGLE_APPLICATION_CREDENTIALS = (process.env.GOOGLE_APPLICATION_CREDENTIALS || '').trim()

const initializeServer = async () => {
  // Setup
  app.use(express.json())

  // Auth
  passport.use(localStrategy)
  passport.serializeUser(serializeUser)
  passport.deserializeUser(deserializeUser)
  app.use(await getSessionMiddleware())

  app.post(
    '/auth/v1/login',
    async (req, res, next) => {
      try {
        const user = await AuthUser.fromRequest(req.body)

        next()
      } catch (err: any) {
        if (err.name === 'ValidationError') {
          // Yup errors from validate
          const errors = (err as ValidationError).inner.map((e) => ({ type: e.type, path: e.path, message: e.message }));
          return res.status(400).json({ errors });
        }
    
        next(err)
      }
    },
    passport.authenticate('local'),
    (req, res) => {
      res.status(200).send(req.user)
    }
  )

  app.use(passport.authenticate('session'), (req, res, next) => {
    if (!req.user) {
      res.sendStatus(401)
    } else {
      next()
    }
  })

  app.delete('/auth/v1/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) {
        next(err)
      }

      res.sendStatus(200)
    })
  })

  // Everything else
  app.use(express.static('demo'))
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../demo/index.html'))
  })

  app.get('/random-bytes', (req, res, next) => {
    crypto.randomBytes(64, (err, buf) => {
      if (err) {
        next(err);
      } else {
        res.status(200).send(buf.toString('hex'));
      }
    })
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

  // Routes
  app.use('/api/v1', apiRouter)

  // Catch all
  app.use('*', (req, res) => {
    res.sendStatus(404)
  })

  // Catch-all error handler
  app.use(async (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) {
      return next(err)
    }

    const db = await Database.getInstance()
    await LogRepository.insert(db, {
      logType: LogTypes.SMITHERS_SERVER_ERROR,
      explanation: "Smithers server catch-all caught unknown error",
      info: {
        error: err && err.stack ? err.stack : err
      },
      loggedOn: new Date()
    })

    res.sendStatus(500)
  })

  // Server start
  app.listen(port, () => {
    console.log(`budget-server listening on port ${port}`)
  })
}

initializeServer()