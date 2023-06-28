import { Strategy as LocalStrategy } from 'passport-local'
import * as argon2 from 'argon2'
import { User, UserInfo } from './user'

// Resolves to a user if validation was successful, otherwise false
const validate = async (username: string, password: string): Promise<UserInfo | null> => {
  // TODO: Actually create users collection
  // Get user
  const user: User = {
    user_id: username,
    password_hash: '$argon2id$v=19$m=65536,t=3,p=4$fvWgxyDz+MsQJzgQCCMSbw$wxllJac4zklDcWy4uodKs7AnRMTWD8/SwSnK+5TaOdI',
    lockout: false
  }

  // Verify the password
  if (await argon2.verify(user.password_hash, password)) {
    const userInfo: UserInfo = {
      userId: user.user_id,
      lockout: user.lockout
    }
  
    return userInfo
  } else {
    return null
  }
}

const localStrategy = new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await validate(username, password)
    
      if (user) {
        done(null, user)
      } else {
        done(null, false)
      }
    } catch (err) {
      done(err)
    }
  }
)

export {
  localStrategy,
}