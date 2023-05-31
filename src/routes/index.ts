import { crawlTargetRouter } from './CrawlTarget'
import { mangasRouter } from './Manga'
import { latestMangaUpdateRouter } from './Manga/LatestMangaUpdate'
import express from 'express'

const apiRouter = express.Router()

apiRouter.use('/crawl-targets', crawlTargetRouter)
apiRouter.use('/latest-manga-update', latestMangaUpdateRouter)
apiRouter.use('/manga', mangasRouter)

export {
  apiRouter
}