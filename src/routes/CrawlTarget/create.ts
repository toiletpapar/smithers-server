import { ValidationError } from 'yup'
import { Request, Response, NextFunction } from 'express'
import { CrawlTargetRepository, CrawlTarget, ICrawlTarget, Database } from '@ca-tyler/smithers-server-utils'
import { removeItems } from '../../utils/arrayUtils'

const createCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Change to use an allow list of properties to validate against, similar to updateFactory
    const data = await CrawlTarget.validateRequest(
      {...req.body, userId: req.user?.userId},
      ['name', 'adapter', 'url', 'userId']
    ) as Pick<ICrawlTarget, 'name' | 'adapter' | 'url' | 'userId'>
    const crawlTarget = await CrawlTargetRepository.insert(await Database.getInstance(), {
      ...data,
      lastCrawledOn: null,
      crawlSuccess: null,
      favourite: false,
      coverFormat: null,
      coverImage: null,
      coverSignature: null
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