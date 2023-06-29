import { createMangaUpdate } from './create'
import express from 'express'
import { listMangaUpdate } from './list'

const mangaUpdateRouter = express.Router()

mangaUpdateRouter.get('/', listMangaUpdate)
mangaUpdateRouter.post('/', createMangaUpdate)

export {
  mangaUpdateRouter
}