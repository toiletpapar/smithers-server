import { QueryResult } from 'pg'
import { Database } from '../database/Database'
import { IUser, User } from '../models/User';

interface SQLUser {
  user_id: string;
  username: string;
  password_hash: string;
  lockout: boolean;
}

namespace UserRepository {
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