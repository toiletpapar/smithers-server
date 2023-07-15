import * as argon2 from "argon2"

const hash = async (value: string): Promise<string> => {
  return argon2.hash(value, {memoryCost: 1024, parallelism: 1, timeCost: 2})
}

const verify = async (valueHash: string, value: string): Promise<boolean> => {
  return argon2.verify(valueHash, value, {memoryCost: 1024, parallelism: 1, timeCost: 2})
}

export {
  hash,
  verify
}