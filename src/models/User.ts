import { SQLUser } from '../repositories/UserRepository';

interface IUser {
  userId: string;
  username: string;
  passwordHash: string;
  lockout: boolean; // TODO: Implement
}
type UserInfo = Omit<IUser, 'passwordHash' | 'lockout'>

class User {
  private data: IUser;

  public constructor(data: IUser) {
    this.data = data
  }

  public static fromSQL(data: SQLUser) {
    return new this({
      userId: data.user_id,
      username: data.username,
      passwordHash: data.password_hash,
      lockout: data.lockout,
    })
  }

  public getObject(): IUser {
    return {
      ...this.data
    }
  }

  public getUserInfo(): UserInfo {
    return {
      userId: this.data.userId,
      username: this.data.username,
    }
  }

  public serialize() {
    return {
      ...this.data,
    }
  }
}

export {
  User,
  IUser,
  UserInfo
}