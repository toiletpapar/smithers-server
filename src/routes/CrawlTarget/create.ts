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
      const errors = err.errors.map((e: string) => ({ message: e }));
      return res.status(400).json({ errors });
    }

    next(err)
  }
}

export {
  createCrawlTarget
}