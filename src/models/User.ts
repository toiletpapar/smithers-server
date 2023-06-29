import { SQLUser } from '../repositories/UserRepository';

interface IUser {
  userId: string;
  username: string;
  passwordHash: string;
  lockout: boolean;
}

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

  public serialize() {
    return {
      ...this.data,
    }
  }
}

export {
  User,
  IUser,
}