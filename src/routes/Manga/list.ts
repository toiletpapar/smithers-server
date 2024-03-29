import { ValidationError } from 'yup'
import { MangaRepository, MangaListOptions, Database } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'

const listMangas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = await Database.getInstance()
    const options = await MangaListOptions.fromRequest({...req.query, userId: req.user?.userId})
    const mangas = await MangaRepository.list(db, options)
    const serializedMangas = await Promise.all(mangas.map((manga) => manga.serialize()))

    res.status(200).json(serializedMangas)
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
  listMangas
}