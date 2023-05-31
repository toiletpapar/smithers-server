import express from 'express'
import { listMangas } from './list'

const mangasRouter = express.Router()

mangasRouter.get('/', listMangas)

export {
  mangasRouter
}