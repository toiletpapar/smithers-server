import * as argon2 from "argon2"

const hash = async (value: string): Promise<string> => {
  return argon2.hash(value, {memoryCost: 4096, parallelism: 1, timeCost: 1})
}

const verify = async (valueHash: string, value: string): Promise<boolean> => {
  return argon2.verify(valueHash, value, {memoryCost: 4096, parallelism: 1, timeCost: 1})
}

export {
  hash,
  verify
}