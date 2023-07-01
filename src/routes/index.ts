import { crawlTargetRouter } from './CrawlTarget'
import { mangasRouter } from './Manga'
import { mangaUpdateRouter } from './Manga/MangaUpdate'
import { userRouter } from './User'
import express from 'express'

const apiRouter = express.Router()

apiRouter.use('/crawl-targets', crawlTargetRouter)
apiRouter.use('/manga-update', mangaUpdateRouter)
apiRouter.use('/manga', mangasRouter)
apiRouter.use('/user', userRouter)

export {
  apiRouter
}