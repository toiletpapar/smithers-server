import { ValidationError } from 'yup'
import { CrawlTargetListOptions } from '../../models/CrawlTargetListOptions'
import { CrawlTargetRepository } from '../../repositories/CrawlTargetRepository'
import { Request, Response, NextFunction } from 'express'
import { Database } from '../../database/Database'

const listCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: CrawlTargetListOptions = await CrawlTargetListOptions.fromRequest({userId: req.user?.userId})
    const crawlTargets = await CrawlTargetRepository.list(await Database.getInstance(), options)
    const serializedCrawlTargets = crawlTargets.map((crawlTarget) => crawlTarget.serialize())

    res.status(200).json(serializedCrawlTargets)
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      // Yup errors from validate
      const errors = (err as ValidationError).inner.map((e) => ({ type: e.type, path: e.path, message: e.message }));
      return res.status(400).json({ errors });
    }

    next(err)
  }
}

export {
  listCrawlTarget
}