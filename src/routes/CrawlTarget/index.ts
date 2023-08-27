import express from 'express'
import { createCrawlTarget } from './create'
import { listCrawlTarget } from './list'
import { updateCrawlTargetFactory } from './updateFactory'
import { getCrawlTarget } from './get'
import { searchCrawlTarget } from './search'
import { getCrawlTargetImage } from './getImage'

const crawlTargetRouter = express.Router()

crawlTargetRouter.get('/', listCrawlTarget)
crawlTargetRouter.get('/search', searchCrawlTarget)
crawlTargetRouter.get('/:crawlTargetId', getCrawlTarget)
crawlTargetRouter.get('/:crawlTargetId/cover', getCrawlTargetImage)
crawlTargetRouter.post('/', createCrawlTarget)
crawlTargetRouter.patch('/:crawlTargetId', updateCrawlTargetFactory(['name', 'url', 'adapter']))
crawlTargetRouter.patch('/:crawlTargetId/favourite', updateCrawlTargetFactory(['favourite']))

export {
  crawlTargetRouter
}