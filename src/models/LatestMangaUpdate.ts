import { QueryResult } from 'pg'
import { Database } from '../database/Database'
import { object, string, boolean, number } from 'yup'
import { isISO8601 } from '../utils/isISO8601'
import { Model, ModelStatic } from './model'

interface ILatestMangaUpdate {
  latestMangaUpdateId?: number; // identifier, primary
  crawlId: number; // the identifier of the crawler that produced the result, foreign
  crawledOn: Date; // the date this update was logged
  chapter: number; // number of the chapter
  chapterName: string | null; // name of the chapter
  isRead: boolean; // whether the user read the update, logged onClick
  readAt: string; // a link to read the chapter
}

interface SQLLatestMangaUpdate {
  latest_manga_update_id?: number;
  crawl_target_id: number;
  crawled_on: Date;
  chapter: number;
  chapter_name: string | null;
  is_read: boolean;
  read_at: string;
}

const LatestMangaUpdate: ModelStatic<ILatestMangaUpdate, SQLLatestMangaUpdate> = class implements Model<ILatestMangaUpdate, SQLLatestMangaUpdate> {
  private data: ILatestMangaUpdate;
  private static validSchema = object({
    latestMangaUpdateId: number().optional(),
    crawlId: number().required(),
    crawledOn: string().required().test('is-iso8601', 'Value must be in ISO8601 format', isISO8601),
    chapter: number().min(0).integer().required(),
    chapterName: string().defined().nullable(),
    isRead: boolean().required(),
    readAt: string().url().required(),
  }).strict(true)

  public constructor(data: ILatestMangaUpdate) {
    this.data = data
  }

  public static fromSQL(data: SQLLatestMangaUpdate) {
    return new this({
      latestMangaUpdateId: data.latest_manga_update_id,
      crawlId: data.crawl_target_id,
      crawledOn: data.crawled_on,
      chapter: data.chapter,
      chapterName: data.chapter_name,
      isRead: data.is_read,
      readAt: data.read_at,
    })
  }

  public static async list(): Promise<QueryResult<SQLLatestMangaUpdate>> {
    const db = await Database.getInstance()

    return await db.query({
      text: 'SELECT * FROM latest_manga_update;',
    })
  }

  public static async validate(data: any): Promise<ILatestMangaUpdate> {
    const validSchema = await this.validSchema.validate(data, {abortEarly: false})

    return {
      ...validSchema,
      // Coerce into date
      crawledOn: new Date(validSchema.crawledOn)
    }
  }

  public getObject(): ILatestMangaUpdate {
    return this.data
  }

  public async insert(): Promise<QueryResult<SQLLatestMangaUpdate>> {
    if (this.data.latestMangaUpdateId) {
      console.log('This crawl target seems to have an id, did you mean to update instead?')

      throw new Error('Tried to insert data with an id into a serial column')
    }

    const db = await Database.getInstance()

    return await db.query({
      text: 'INSERT INTO latest_manga_update (crawl_target_id, crawled_on, chapter, chapter_name, is_read, read_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      values: [
        this.data.crawlId,
        this.data.crawledOn,
        this.data.chapter,
        this.data.chapterName,
        this.data.isRead,
        this.data.readAt
      ]
    })
  }
}

export {
  LatestMangaUpdate,
  ILatestMangaUpdate,
  SQLLatestMangaUpdate
}