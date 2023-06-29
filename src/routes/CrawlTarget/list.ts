import { CrawlTargetRepository } from '../../repositories/CrawlTargetRepository'
import { Request, Response, NextFunction } from 'express'

const listCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const crawlTargets = await CrawlTargetRepository.list()
    const serializedCrawlTargets = crawlTargets.map((crawlTarget) => crawlTarget.serialize())

    res.status(200).json(serializedCrawlTargets)
  } catch (err: any) {
    next(err)
  }
}

export {
  listCrawlTarget
}