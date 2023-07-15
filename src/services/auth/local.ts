import { Strategy as LocalStrategy } from 'passport-local'
import { UserInfo } from '../../models/User'
import { UserRepository } from '../../repositories/UserRepository'
import { verify } from '../../utils/hash'

// Resolves to a user if validation was successful, otherwise false
const validate = async (username: string, password: string): Promise<UserInfo | null> => {
  const user = await UserRepository.getByUsername(username)

  if (!user) {
    return user
  }

  // Verify the password
  if (await verify(user.getObject().passwordHash, password)) {
    return user.getUserInfo()
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