import PGStore from 'connect-pg-simple'
import ExpressSession from 'express-session'
import { Database } from '../database/Database'
import { User, UserInfo } from './user'

interface SessionInfo {
  user_id: string;
}

const getSessionMiddleware = async () => {
  const SessionStore = PGStore(ExpressSession)
  const db = await Database.getInstance()
  const session = ExpressSession({
    store: new SessionStore({
      pool: db.getPoolInstance(),
      tableName: 'user_sessions',
      createTableIfMissing: true
    }),
    secret: 'HELLO_WORLD',  // TODO: Change to use secret
    resave: false,
    cookie: {
      maxAge: 30*24*60*60*1000
      // TODO: user secure cookies
    },
    saveUninitialized: false
  })

  return session
}

const serializeUser = async (user: any, done: (err: any, id?: SessionInfo) => void) => {
  console.log('serialize')
  done(null, {user_id: user.userId})
}

const deserializeUser = async (sessionInfo: SessionInfo, done: (err: any, id?: UserInfo | boolean) => void) => {
  console.log('deserialize')
  try {
    // TODO: Actually create users collection
    // Get user based on session info
    const user: User = {
      user_id: 'test',
      password_hash: '$argon2id$v=19$m=65536,t=3,p=4$fvWgxyDz+MsQJzgQCCMSbw$wxllJac4zklDcWy4uodKs7AnRMTWD8/SwSnK+5TaOdI',
      lockout: false
    }

    // Massage into user info
    const userInfo: UserInfo = {
      userId: user.user_id,
      lockout: user.lockout
    }

    if (userInfo) {
      return done(null, userInfo)
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