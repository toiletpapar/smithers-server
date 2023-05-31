import { ValidationError, object, string } from 'yup'
import { Manga, MangaListOptions } from '../../models/Manga'
import { Request, Response, NextFunction } from 'express'

const querySchema = object({
  onlyLatest: string().oneOf(['true', 'false']).optional(),
}).strict(true)

const listMangas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const params = await querySchema.validate(req.query, {abortEarly: false})
    
    // massage
    const listOptions: MangaListOptions = {
      ...params,
      onlyLatest: params.onlyLatest != undefined ? params.onlyLatest === 'true' : undefined
    }

    const sqlResult = await Manga.list(listOptions)
    const mangas = sqlResult.rows.map((manga) => Manga.fromSQL(manga).getObject())

    res.status(200).json(mangas)
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