import { ValidationError } from 'yup'
import { CrawlTargetGetOptions, CrawlTargetRepository, Database } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'

const getCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: CrawlTargetGetOptions = await CrawlTargetGetOptions.fromRequest({userId: req.user?.userId, crawlTargetId: req.params.crawlTargetId}, false)
    const crawlTarget = await CrawlTargetRepository.getById(await Database.getInstance(), options)

    if (crawlTarget) {
      res.status(200).json(crawlTarget.serialize())
    } else {
      return res.sendStatus(404)
    }
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
  getCrawlTarget
}