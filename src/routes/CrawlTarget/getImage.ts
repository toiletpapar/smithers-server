import { ValidationError } from 'yup'
import { CrawlTargetGetOptions, CrawlTargetRepository, Database } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import stream from 'stream'

const getCrawlTargetImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options: CrawlTargetGetOptions = await CrawlTargetGetOptions.fromRequest({userId: req.user?.userId, crawlTargetId: req.params.crawlTargetId, projectImage: true}, false)
    const crawlTarget = await CrawlTargetRepository.getById(await Database.getInstance(), options)

    if (crawlTarget) {
      const serialized = await crawlTarget.serialize()

      if (serialized.coverFormat && serialized.coverImage) {
        const bufferStream = new stream.PassThrough()
        bufferStream.end(serialized.coverImage)
        res.setHeader('Content-Type', `image/${serialized.coverFormat}`).status(200)
        bufferStream.pipe(res)
        return
      } else {
        res.sendStatus(404)
        return
      }
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
  getCrawlTargetImage
}