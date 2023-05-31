import { CrawlTarget } from '../../models/CrawlTarget'
import { Request, Response, NextFunction } from 'express'

const listCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sqlResult = await CrawlTarget.list()
    const crawlTargets = sqlResult.rows.map((crawlTarget) => CrawlTarget.fromSQL(crawlTarget).getObject())

    res.status(200).json(crawlTargets)
  } catch (err: any) {
    next(err)
  }
}

export {
  listCrawlTarget
}