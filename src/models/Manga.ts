import { QueryResult } from "pg";
import { CrawlTarget, ICrawlTarget, SQLCrawlTarget } from "./CrawlTarget";
import { ILatestMangaUpdate, LatestMangaUpdate, SQLLatestMangaUpdate } from "./LatestMangaUpdate";
import { Database } from "../database/Database";

interface IManga {
  crawler: ICrawlTarget;
  mangaUpdates: ILatestMangaUpdate[];
}

interface SQLManga {
  crawler: SQLCrawlTarget;
  manga_updates: SQLLatestMangaUpdate[];
}

interface MangaListOptions {
  onlyLatest?: Boolean
}

class Manga {
  private data: IManga;

  constructor (data: IManga) {
    this.data = data
  }

  public static fromSQL(data: SQLManga) {
    return new this({
      crawler: CrawlTarget.fromSQL(data.crawler).getObject(),
      mangaUpdates: data.manga_updates.map((update) => LatestMangaUpdate.fromSQL(update).getObject())
    })
  }

  private static defaultListOptions: MangaListOptions = {
    onlyLatest: true
  }

  public static async list(options: MangaListOptions): Promise<QueryResult<SQLManga>> {
    const db = await Database.getInstance()

    const opts = {
      ...this.defaultListOptions,
      ...options
    }

    // TODO: Stored Procedures
    if (opts.onlyLatest) {
      return await db.query({
        text: `
          SELECT
            x.crawler,
            x.manga_updates
          FROM (
            SELECT
              json_build_object(
                'crawl_target_id', crawl_target_id,
                'name', name,
                'url', url,
                'adapter', adapter,
                'last_crawled_on', last_crawled_on,
                'crawl_success', crawl_success
              ) crawler,
              CASE
                WHEN latest_manga_update_id IS NULL THEN ARRAY[]::json[]
                ELSE ARRAY[json_build_object(
                  'latest_manga_update_id', latest_manga_update_id,
                  'chapter', chapter,
                  'chapter_name', chapter_name,
                  'crawled_on', crawled_on,
                  'is_read', is_read,
                  'read_at', read_at
                  )]
              END AS manga_updates,
              row_number() OVER (PARTITION BY crawl_target_id order by crawled_on DESC) as _rn
            FROM crawl_target
            LEFT JOIN latest_manga_update
            USING (crawl_target_id)
            ORDER BY crawl_target_id
          ) x
          WHERE _rn = 1;
        `
      })
    } else {
      return await db.query({
        text: `
          SELECT 
            json_build_object(
              'crawl_target_id', crawl_target_id,
              'name', name,
              'url', url,
              'adapter', adapter,
              'last_crawled_on', last_crawled_on,
              'crawl_success', crawl_success
            ) crawler,
            COALESCE(
              json_agg(
                json_build_object(
                  'latest_manga_update_id', latest_manga_update_id,
                  'chapter', chapter,
                  'chapter_name', chapter_name,
                  'crawled_on', crawled_on,
                  'is_read', is_read,
                  'read_at', read_at
                )
              ) FILTER (WHERE latest_manga_update_id IS NOT NULL),
              '[]'
            ) AS manga_updates
          FROM crawl_target
          LEFT JOIN latest_manga_update
          USING (crawl_target_id)
          GROUP BY crawl_target_id
          ORDER BY crawl_target_id;
        `,
      })
    }
  }

  public getObject(): IManga {
    return this.data
  }
}

export {
  Manga,
  MangaListOptions
}