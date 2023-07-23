import { ValidationError } from 'yup'
import { IMangaUpdate, MangaUpdate, MangaUpdateRepository, Database } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'
import { removeItem } from '../../../utils/arrayUtils'

const updateMangaUpdateFactory = (properties: Exclude<(keyof IMangaUpdate),'mangaUpdateId' | 'crawlId' | 'chapter'>[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // TODO: allow only specific users to update specific mangaUpdate
    const {mangaUpdateId} = await MangaUpdate.validateRequest({mangaUpdateId: req.params.mangaUpdateId}, ['mangaUpdateId'], false) as Pick<IMangaUpdate, 'mangaUpdateId'>
    const data = await MangaUpdate.validateRequest(req.body, properties) as Partial<Omit<IMangaUpdate, 'mangaUpdateId' | 'crawlId' | 'chapter'>>
    const mangaUpdate = await MangaUpdateRepository.update(await Database.getInstance(), mangaUpdateId, data)

    if (mangaUpdate) {
      const serializedMangaUpdate = mangaUpdate.serialize()

      return res.status(200).json(serializedMangaUpdate)
    } else {
      return res.sendStatus(404)
    }
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
  updateMangaUpdateFactory
}