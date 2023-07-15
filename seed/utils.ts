import fs from 'fs'
import util from 'util'
import { faker } from '@faker-js/faker'

const getSchemaSQL = async (schemaFilePath: string): Promise<string> => {
  const readFile = util.promisify(fs.readFile)
  
  return readFile(schemaFilePath, 'utf-8')
}

const removeRandomElements = (arr: any[], times: number): any[] => {
  if (times <= 0) {
    return arr
  } else {
    const randomIndex = faker.datatype.number(arr.length - 1)

    return removeRandomElements(
      [
        ...arr.slice(0, randomIndex),
        ...arr.slice(randomIndex + 1)
      ],
      times - 1
    )
  }
}

export {
  getSchemaSQL,
  removeRandomElements,
}