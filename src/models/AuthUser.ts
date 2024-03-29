import { object, string, array } from 'yup'

interface IAuthUser {
  username: string;
  password: string;
}

class AuthUser {
  private data: IAuthUser;
  static allProperties: (keyof IAuthUser)[] = ['username', 'password']
  private static propertiesSchema = array().of(string().oneOf(this.allProperties).defined()).defined().strict(true)
  private static dataSchema = object({
    username: string().max(100).required(),
    password: string().required()
  }).noUnknown().strict(true)

  public constructor(data: IAuthUser) {
    this.data = data
  }

  public static async fromRequest(data: any) {
    const result = (await this.validateRequest(data, this.allProperties)) as IAuthUser

    return new this({
      username: result.username,
      password: result.password
    })
  }

  // Validates the provided data against the properties specified, returning a coerced partial object
  public static async validateRequest(data: any, properties: string[], strict: boolean = true): Promise<Partial<IAuthUser>> {
    // Validate properties provided by the request
    const validatedProperties = await this.propertiesSchema.validate(properties)

    // Validate the data against the specified properties, erroring on any unidentified properties
    const validationSchema = this.dataSchema.pick(validatedProperties).strict(strict)
    const validatedData = await validationSchema.validate(data, {abortEarly: false})

    return validatedData
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