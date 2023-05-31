import { ValidationError } from 'yup'
import { LatestMangaUpdate } from '../../../models/LatestMangaUpdate'
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
      const errors = (err as ValidationError).inner.map((e) => ({ type: e.type, path: e.path, message: e.message }));
      return res.status(400).json({ errors });
    }

    next(err)
  }
}

export {
  createLatestMangaUpdate
}