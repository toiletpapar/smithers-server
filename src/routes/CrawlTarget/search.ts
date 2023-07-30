import { ValidationError } from 'yup'
import { CrawlTargetRepository, ICrawlTarget } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'
import { CrawlTargetSourceSearchOptions } from '@ca-tyler/smithers-server-utils/build/models/crawlers/CrawlTargetSourceSearchOptions'

const searchCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: CrawlTargetSourceSearchOptions = await CrawlTargetSourceSearchOptions.fromRequest({...req.query, userId: req.user?.userId}, false)
    const crawlTargets = await CrawlTargetRepository.search(options)
    const serializedCrawlTargets: Pick<ICrawlTarget, 'name' | 'url' | 'adapter'>[] = await Promise.all(crawlTargets.map((crawlTarget) => {
      return {
        name: crawlTarget.name,
        url: crawlTarget.url,
        adapter: crawlTarget.adapter
      }
    }))

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
  searchCrawlTarget
}