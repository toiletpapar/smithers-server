import PGStore from 'connect-pg-simple'
import ExpressSession from 'express-session'
import { Database } from '../../database/Database'
import { UserInfo } from '../../models/User'
import { UserRepository } from '../../repositories/UserRepository';
import { SecretClient } from '../../secrets/SecretClient';

interface SessionInfo {
  user_id: number;
}

const getSessionMiddleware = async () => {
  const SessionStore = PGStore(ExpressSession)
  const db = await Database.getInstance()
  const client = await SecretClient.getInstance()
  const sessionSecret = await client.getSecret({secretName: 'local-session'})

  if (!sessionSecret) {
    throw new Error('Unable to find session secret')
  }

  const session = ExpressSession({
    store: new SessionStore({
      pool: db.getPoolInstance(),
      tableName: 'user_sessions',
      createTableIfMissing: true
    }),
    secret: sessionSecret,
    resave: false,
    cookie: {
      maxAge: 30*24*60*60*1000
      // TODO: user secure cookies after deploying
    },
    saveUninitialized: false
  })

  return session
}

const serializeUser = async (user: any, done: (err: any, id?: SessionInfo) => void) => {
  done(null, {user_id: user.userId})
}

const deserializeUser = async (sessionInfo: SessionInfo, done: (err: any, id?: UserInfo | boolean) => void) => {
  try {
    const user = await UserRepository.getById(sessionInfo.user_id)

    if (user) {
      return done(null, user.getUserInfo())
    } else {
      return done(null, false)
    }
  } catch (err) {
    done(err)
  }
}

export {
  getSessionMiddleware,
  serializeUser,
  deserializeUser
}