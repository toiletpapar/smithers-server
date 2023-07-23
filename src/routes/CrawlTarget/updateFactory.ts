import { ValidationError } from 'yup'
import { ICrawlTarget, CrawlTarget, CrawlTargetRepository, Database } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'

const updateCrawlTargetFactory = (validProperties: Exclude<(keyof ICrawlTarget),'crawlTargetId' | 'userId'>[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {crawlTargetId, userId} = await CrawlTarget.validateRequest(
      {crawlTargetId: req.params.crawlTargetId, userId: req.user?.userId},
      ['crawlTargetId', 'userId'],
      false
    ) as Pick<ICrawlTarget, 'crawlTargetId' | 'userId'>
    const data = await CrawlTarget.validateRequest(req.body.data, req.body.properties, true, validProperties) as Partial<Omit<ICrawlTarget, 'crawlTargetId' | 'userId'>>
    const crawlTarget = await CrawlTargetRepository.update(await Database.getInstance(), crawlTargetId, data, userId)

    if (crawlTarget) {
      const serializedCrawlTarget = crawlTarget.serialize()

      return res.status(200).json(serializedCrawlTarget)
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
  updateCrawlTargetFactory
}