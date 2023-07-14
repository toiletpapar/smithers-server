import fs from 'fs'
import util from 'util'
import path from 'path'

const getSchemaSQL = async (schemaFilePath: string): Promise<string> => {
  const readFile = util.promisify(fs.readFile)
  
  return readFile(schemaFilePath, 'utf-8')
}

export {
  getSchemaSQL
}