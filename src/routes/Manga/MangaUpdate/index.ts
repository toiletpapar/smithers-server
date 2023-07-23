import express from 'express'
import { listMangaUpdate } from './list'
import { updateMangaUpdateFactory } from './updateFactory'

const mangaUpdateRouter = express.Router()

mangaUpdateRouter.get('/', listMangaUpdate)
mangaUpdateRouter.patch('/:mangaUpdateId/isRead', updateMangaUpdateFactory(['isRead']))

export {
  mangaUpdateRouter
}