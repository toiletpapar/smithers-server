import { ValidationError } from 'yup'
import { MangaRepository, MangaSyncOptions, Database, SmithersErrorTypes } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'

const syncManga = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = await Database.getInstance()
    const options = await MangaSyncOptions.fromRequest({crawlTargetId: req.params.crawlTargetId, userId: req.user?.userId}, false)

    // Possibly long-running, depending on the parse and source
    // TODO: Consider workers, or spawning jobs in k8s
    await MangaRepository.syncManga(db, options)

    res.sendStatus(200)
  } catch (err: any) {
    if (err.name === 'ValidationError') {
      // Yup errors from validate
      const errors = (err as ValidationError).inner.map((e) => ({ type: e.type, path: e.path, message: e.message }));
      return res.status(400).json({ errors });
    } else if (err.isSmithersError && err.type === SmithersErrorTypes.MANGA_CRAWL_TARGET_NOT_FOUND) {
      return res.sendStatus(404)
    }

    next(err)
  }
}

export {
  syncManga
}