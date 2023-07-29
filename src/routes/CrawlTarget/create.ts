import { ValidationError } from 'yup'
import { Request, Response, NextFunction } from 'express'
import { CrawlTargetRepository, CrawlTarget, ICrawlTarget, Database } from '@ca-tyler/smithers-server-utils'
import { removeItems } from '../../utils/arrayUtils'

const createCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CrawlTarget.validateRequest(
      {...req.body, userId: req.user?.userId},
      removeItems(CrawlTarget.allRequestProperties, ['crawlTargetId', 'lastCrawledOn', 'crawlSuccess', 'favourite'])
    ) as Omit<ICrawlTarget, 'crawlTargetId' | 'lastCrawledOn' | 'crawlSuccess' | 'favourite'>
    const crawlTarget = await CrawlTargetRepository.insert(await Database.getInstance(), {
      ...data,
      lastCrawledOn: null,
      crawlSuccess: null,
      favourite: false
    })
    const serializedCrawlTarget = await crawlTarget.serialize()

    res.status(201).json(serializedCrawlTarget)
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      // Yup errors from validate
      const errors = (err as ValidationError).inner.map((e) => ({ type: e.type, path: e.path, message: e.message }));
      return res.status(400).json({ errors });
    } else if (err.code === '23505') {
      // Invalid key error from SQL
      return res.status(409).json({ errors: [{type: 'duplicate_key', path: 'name', message: err.message}] })
    }

    next(err)
  }
}

export {
  createCrawlTarget
}