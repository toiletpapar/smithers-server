import { LatestMangaUpdate } from '../../models/LatestMangaUpdate'
import { Request, Response, NextFunction } from 'express'

const createLatestMangaUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await LatestMangaUpdate.validate(req.body)
    const sqlResult = await new LatestMangaUpdate(data).insert()
    const latestMangaUpdate = LatestMangaUpdate.fromSQL(sqlResult.rows[0]).getObject()

    res.status(201).json(latestMangaUpdate)
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
  createLatestMangaUpdate
}