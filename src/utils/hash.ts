import * as argon2 from "argon2"
import Bottleneck from "bottleneck"

const limiter = new Bottleneck({maxConcurrent: 1})

const hash = async (value: string): Promise<string> => {
  return limiter.schedule(() => argon2.hash(value, {memoryCost: 1024, parallelism: 1, timeCost: 2}))
}

const verify = async (valueHash: string, value: string): Promise<boolean> => {
  return limiter.schedule(() => argon2.verify(valueHash, value, {memoryCost: 1024, parallelism: 1, timeCost: 2}))
}

export {
  hash,
  verify
}