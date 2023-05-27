import { createLatestMangaUpdate } from './create'
import express from 'express'
import { listLatestMangaUpdate } from './list'

const latestMangaUpdateRouter = express.Router()

latestMangaUpdateRouter.get('/', listLatestMangaUpdate)
latestMangaUpdateRouter.post('/', createLatestMangaUpdate)

export {
  latestMangaUpdateRouter
}