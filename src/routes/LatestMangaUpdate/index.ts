import { createLatestMangaUpdate } from './create'
import express from 'express'

const latestMangaUpdateRouter = express.Router()

latestMangaUpdateRouter.post('/', createLatestMangaUpdate)

export {
  latestMangaUpdateRouter
}