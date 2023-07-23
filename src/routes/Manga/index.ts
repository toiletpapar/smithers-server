import express from 'express'
import { listMangas } from './list'
import { syncManga } from './sync'

const mangasRouter = express.Router()

mangasRouter.get('/', listMangas)
mangasRouter.patch('/:crawlTargetId', syncManga)

export {
  mangasRouter
}