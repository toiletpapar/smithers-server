import { ValidationError } from 'yup'
import { CrawlTarget } from '../../models/CrawlTarget'
import { Request, Response, NextFunction } from 'express'

const createCrawlTarget = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await CrawlTarget.validate(req.body)
    const sqlResult = await new CrawlTarget(data).insert()
    const crawlTarget = CrawlTarget.fromSQL(sqlResult.rows[0]).getObject()

    res.status(201).json(crawlTarget)
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      // Yup errors from validate
      const errors = (err as ValidationError).inner.map((e) => ({ type: e.type, path: e.path, message: e.message }));
      return res.status(400).json({ errors });
    } else if (err.code === '23505' && err.constraint === 'crawl_target_name_key') {
      // Invalid key error from SQL
      return res.status(409).json({ type: 'duplicate_key', path: 'name', message: err.message })
    }

    next(err)
  }
}

export {
  createCrawlTarget
}