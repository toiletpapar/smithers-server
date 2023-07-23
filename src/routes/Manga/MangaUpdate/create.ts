import { ValidationError } from 'yup'
import { IMangaUpdate, MangaUpdate, MangaUpdateRepository, Database } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'
import { removeItem } from '../../../utils/arrayUtils'

const createMangaUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Add machine-to-machine authentication, disallow other forms of authentication
    const data = await MangaUpdate.validateRequest(req.body, removeItem(MangaUpdate.allRequestProperties, 'mangaUpdateId')) as Omit<IMangaUpdate, 'mangaUpdateId'>
    const mangaUpdate = await MangaUpdateRepository.insert(await Database.getInstance(), data)
    const serializedMangaUpdate = mangaUpdate.serialize()

    res.status(201).json(serializedMangaUpdate)
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
  createMangaUpdate
}