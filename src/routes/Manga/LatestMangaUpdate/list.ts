import { LatestMangaUpdate } from '../../../models/LatestMangaUpdate'
import { Request, Response, NextFunction } from 'express'

const listLatestMangaUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sqlResult = await LatestMangaUpdate.list()
    const latestMangaUpdates = sqlResult.rows.map((latestMangaUpdate) => LatestMangaUpdate.fromSQL(latestMangaUpdate).getObject())

    res.status(200).json(latestMangaUpdates)
  } catch (err: any) {
    next(err)
  }
}

export {
  listLatestMangaUpdate
}