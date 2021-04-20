import fs from 'fs/promises'
import path from 'path'
import * as db from './db'
import dotEnv from 'dotenv'

const getJsFilesInDir = async pathToDir => {
  const dir = await fs.readdir(pathToDir)

  return dir.filter(item => item.includes('.js'))
    .map(fileName => path.resolve(pathToDir, fileName))
}

const initModels = async () => {
  const models = await getJsFilesInDir(path.resolve(__dirname, '../models'))

  await Promise.all(models.map(path => import(path)))
}

const bootstrap = async () => {
  try {
    await dotEnv.config()
    await initModels()
    await db.init()
  } catch (e) {
    await db.close()

    throw e
  }
}

export default bootstrap