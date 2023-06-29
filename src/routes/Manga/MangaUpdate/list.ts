import { Request, Response, NextFunction } from 'express'
import { MangaUpdateRepository } from '../../../repositories/MangaUpdateRepository'

const listMangaUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const mangaUpdates = await MangaUpdateRepository.list()
    const serializedMangaUpdates = mangaUpdates.map((update) => update.serialize())

    res.status(200).json(serializedMangaUpdates)
  } catch (err: any) {
    next(err)
  }
}

export {
  listMangaUpdate
}