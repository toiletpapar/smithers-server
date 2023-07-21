import { Request, Response, NextFunction } from 'express'
import { MangaUpdateRepository } from '../../../repositories/MangaUpdateRepository'
import { MangaUpdateListOptions } from '../../../models/MangaUpdateListOptions'
import { ValidationError } from 'yup'
import { Database } from '../../../database/Database'

const listMangaUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: MangaUpdateListOptions = await MangaUpdateListOptions.fromRequest({userId: req.user?.userId})
    const mangaUpdates = await MangaUpdateRepository.list(await Database.getInstance(), options)
    const serializedMangaUpdates = mangaUpdates.map((update) => update.serialize())

    res.status(200).json(serializedMangaUpdates)
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
  listMangaUpdate
}