import express from 'express'
import { createCrawlTarget } from './create'
import { listCrawlTarget } from './list'
import { updateCrawlTargetFactory } from './updateFactory'

const crawlTargetRouter = express.Router()

crawlTargetRouter.get('/', listCrawlTarget)
crawlTargetRouter.post('/', createCrawlTarget)
crawlTargetRouter.patch('/:crawlTargetId', updateCrawlTargetFactory(['name', 'url', 'adapter']))

export {
  crawlTargetRouter
}