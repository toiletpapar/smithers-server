import { ValidationError, object, string } from 'yup'
import { MangaListOptions, MangaRepository } from '../../repositories/MangaRepository'
import { Request, Response, NextFunction } from 'express'
import { decodeBoolean } from '../../utils/decodeQuery'

const querySchema = object({
  onlyLatest: string().oneOf(['true', 'false']).optional(),
}).strict(true)

const listMangas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = await querySchema.validate(req.query, {abortEarly: false})
    
    // massage
    const listOptions: MangaListOptions = {}

    if (decodeBoolean(params.onlyLatest) !== undefined) {
      listOptions.onlyLatest = decodeBoolean(params.onlyLatest)
    }

    const mangas = await MangaRepository.list(listOptions)
    const serializedMangas = mangas.map((manga) => manga.serialize())

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