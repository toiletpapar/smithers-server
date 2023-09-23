import { ValidationError } from 'yup'
import { CrawlTargetGetOptions, CrawlTargetRepository, Database, LogRepository, LogTypes } from '@ca-tyler/smithers-server-utils'
import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import stream from 'stream'

const getCrawlTargetImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const db = await Database.getInstance()
    const options: CrawlTargetGetOptions = await CrawlTargetGetOptions.fromRequest({userId: req.user?.userId, crawlTargetId: req.params.crawlTargetId, projectImage: true}, false)
    const crawlTarget = await CrawlTargetRepository.getById(db, options)

    if (crawlTarget) {
      const crawlTargetObj = await crawlTarget.getObject()

      if (crawlTargetObj.coverFormat && crawlTargetObj.coverImage) {
        const bufferStream = new stream.PassThrough()
        bufferStream.end(crawlTargetObj.coverImage)

        if (crawlTargetObj.coverSignature) {
          res.setHeader('X-Smithers-Image-Signature', crawlTargetObj.coverSignature.toString('hex'))
        } else {
          // Report anomaly to logging
          await LogRepository.insert(db, {
            logType: LogTypes.SMITHERS_SERVER_WARN,
            explanation: "Image signature is null even though an image was found",
            info: crawlTargetObj,
            loggedOn: new Date()
          })
        }

        res.setHeader('Content-Type', `image/${crawlTargetObj.coverFormat}`).status(200)
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