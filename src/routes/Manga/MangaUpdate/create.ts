import { ValidationError } from 'yup'
import { IMangaUpdate, MangaUpdate } from '../../../models/MangaUpdate'
import { Request, Response, NextFunction } from 'express'
import { MangaUpdateRepository } from '../../../repositories/MangaUpdateRepository'
import { removeItem } from '../../../utils/arrayUtils'

const createMangaUpdate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: Add machine-to-machine authentication, disallow other forms of authentication
    const data = await MangaUpdate.validateRequest(req.body, removeItem(MangaUpdate.allProperties, 'mangaUpdateId')) as Omit<IMangaUpdate, 'mangaUpdateId'>
    const mangaUpdate = await MangaUpdateRepository.insert(data)
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