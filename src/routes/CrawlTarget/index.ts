import express from 'express'
import { createCrawlTarget } from './create'

const crawlTargetRouter = express.Router()

crawlTargetRouter.post('/', createCrawlTarget)

export {
  crawlTargetRouter
}