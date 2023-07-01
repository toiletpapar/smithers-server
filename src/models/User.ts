import { array, number, object, string, boolean } from 'yup';
import { SQLUser } from '../repositories/UserRepository';

interface IUser {
  userId: number;
  username: string;
  passwordHash: string;
  lockout: boolean; // TODO: Implement
}
type UserInfo = Omit<IUser, 'passwordHash' | 'lockout'>

class User {
  private data: IUser;
  static allProperties: (keyof IUser)[] = ['userId', 'username', 'passwordHash', 'lockout']
  private static propertiesSchema = array().of(string().oneOf(this.allProperties).defined()).defined().strict(true)
  private static dataSchema = object({
    userId: number().required(),
    username: string().max(100).required(),
    passwordHash: string().url().required(),
    lockout: boolean().defined().required()
  }).noUnknown()

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

  public static async validateRequest(data: any, properties: string[], strict: boolean = true): Promise<Partial<IUser>> {
    // Validate properties provided by the request
    const validatedProperties = await this.propertiesSchema.validate(properties)

    // Validate the data against the specified properties, erroring on any unidentified properties
    const validationSchema = this.dataSchema.pick(validatedProperties).strict(strict)
    const validatedData = await validationSchema.validate(data, {abortEarly: false})
    
    return validatedData
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
      ...this.getUserInfo(),
    }
  }
}

export {
  User,
  IUser,
  UserInfo
}