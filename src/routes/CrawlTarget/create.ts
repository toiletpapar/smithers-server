import { ValidationError } from 'yup'
import { Request, Response, NextFunction } from 'express'
import { CrawlTargetRepository } from '../../repositories/CrawlTargetRepository'
import { CrawlTarget, ICrawlTarget } from '../../models/CrawlTarget'
import { removeItems } from '../../utils/arrayUtils'

const createCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CrawlTarget.validateRequest(
      {...req.body, userId: req.user?.userId},
      removeItems(CrawlTarget.allProperties, ['crawlTargetId', 'lastCrawledOn', 'crawlSuccess'])
    ) as Omit<ICrawlTarget, 'crawlTargetId' | 'lastCrawledOn' | 'crawlSuccess'>
    const crawlTarget = await CrawlTargetRepository.insert({
      ...data,
      lastCrawledOn: null,
      crawlSuccess: null
    })
    const serializedCrawlTarget = crawlTarget.serialize()

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