import { crawlTargetRouter } from './CrawlTarget'
import { latestMangaUpdateRouter } from './LatestMangaUpdate'
import express from 'express'

const apiRouter = express.Router()

apiRouter.use('/crawl-targets', crawlTargetRouter)
apiRouter.use('/latest-manga-update', latestMangaUpdateRouter)

export {
  apiRouter
}