import express from 'express'
import { createCrawlTarget } from './create'
import { listCrawlTarget } from './list'

const crawlTargetRouter = express.Router()

crawlTargetRouter.get('/', listCrawlTarget)
crawlTargetRouter.post('/', createCrawlTarget)

export {
  crawlTargetRouter
}