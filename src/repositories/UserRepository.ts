import { QueryResult } from 'pg'
import { Database } from '@ca-tyler/smithers-server-utils'
import { IUser, User } from '../models/User';

interface SQLUser {
  user_id: number;
  username: string;
  password_hash: string;
  lockout: boolean;
}

namespace UserRepository {
  const get = async (key: 'username' | 'user_id' = 'user_id', value: string | number): Promise<User | null> => {
    const db = await Database.getInstance()

    const result: QueryResult<SQLUser> = await db.query({
      text: `SELECT * FROM users WHERE ${key} = $1`,
      values: [
        value,
      ]
    })
  
    if (result.rows[0]) {
      return User.fromSQL(result.rows[0])
    } else {
      return null
    }
  }

  export const getById = (id: number) => get('user_id', id)
  export const getByUsername = (username: string) => get('username', username)

  export const insert = async (user: Omit<IUser, 'userId'>): Promise<User> => {
    const db = await Database.getInstance()

    const result: QueryResult<SQLUser> = await db.query({
      text: 'INSERT INTO users (username, password_hash, lockout) VALUES ($1, $2, $3) RETURNING *;',
      values: [
        user.username,
        user.passwordHash,
        user.lockout,
      ]
    })
  
    return User.fromSQL(result.rows[0])
  }
}

export {
  SQLUser,
  UserRepository
}