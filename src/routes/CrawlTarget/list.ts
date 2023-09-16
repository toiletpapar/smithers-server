import { ValidationError } from 'yup'
import { CrawlTargetListOptions, CrawlTargetRepository, Database } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'

const listCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: CrawlTargetListOptions = await CrawlTargetListOptions.fromRequest({
      ...req.query,
      userId: req.user?.userId,
    })

    const crawlTargets = await CrawlTargetRepository.list(await Database.getInstance(), options)
    const serializedCrawlTargets = await Promise.all(crawlTargets.map((crawlTarget) => crawlTarget.serialize()))

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