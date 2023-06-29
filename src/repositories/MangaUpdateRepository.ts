import { QueryResult } from 'pg'
import { Database } from '../database/Database'
import { IMangaUpdate, MangaUpdate } from '../models/MangaUpdate';

interface SQLMangaUpdate {
  manga_update_id: number;
  crawl_target_id: number;
  crawled_on: Date;
  chapter: number;
  chapter_name: string | null;
  is_read: boolean;
  read_at: string;
}

namespace MangaUpdateRepository {
  export const list = async (): Promise<MangaUpdate[]> => {
    const db = await Database.getInstance()
    const result: QueryResult<SQLMangaUpdate> = await db.query({
      text: 'SELECT * FROM manga_update;',
    })
  
    return result.rows.map((row) => {
      return MangaUpdate.fromSQL(row)
    })
  }
  
  export const insert = async (mangaUpdate: Omit<IMangaUpdate, 'mangaUpdateId'>): Promise<MangaUpdate> => {
    const db = await Database.getInstance()
  
    const result: QueryResult<SQLMangaUpdate> = await db.query({
      text: 'INSERT INTO manga_update (crawl_target_id, crawled_on, chapter, chapter_name, is_read, read_at) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;',
      values: [
        mangaUpdate.crawlId,
        mangaUpdate.crawledOn,
        mangaUpdate.chapter,
        mangaUpdate.chapterName,
        mangaUpdate.isRead,
        mangaUpdate.readAt
      ]
    })
  
    return MangaUpdate.fromSQL(result.rows[0])
  }
}

export {
  SQLMangaUpdate,
  MangaUpdateRepository
}