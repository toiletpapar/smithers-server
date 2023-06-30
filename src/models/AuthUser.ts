import { object, string } from 'yup'

interface IAuthUser {
  username: string;
  password: string;
}

class AuthUser {
  private data: IAuthUser;
  private static authSchema = object({
    username: string().max(100).required(),
    password: string().required()
  }).noUnknown().strict(true)

  public constructor(data: IAuthUser) {
    this.data = data
  }

  public static async validate(data: any): Promise<IAuthUser> {
    return await this.authSchema.validate(data, {abortEarly: false})
  }

  public getObject(): IAuthUser {
    return {
      ...this.data
    }
  }
}

export {
  AuthUser,
  IAuthUser,
}