import express from 'express'
import { createCrawlTarget } from './create'
import { listCrawlTarget } from './list'
import { updateCrawlTargetFactory } from './updateFactory'
import { getCrawlTarget } from './get'

const crawlTargetRouter = express.Router()

crawlTargetRouter.get('/', listCrawlTarget)
crawlTargetRouter.get('/:crawlTargetId', getCrawlTarget)
crawlTargetRouter.post('/', createCrawlTarget)
crawlTargetRouter.patch('/:crawlTargetId', updateCrawlTargetFactory(['name', 'url', 'adapter']))
crawlTargetRouter.patch('/:crawlTargetId/favourite', updateCrawlTargetFactory(['favourite']))

export {
  crawlTargetRouter
}