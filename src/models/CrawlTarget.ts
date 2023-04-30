import { QueryResult } from 'pg'
import { Database } from '../database/Database'

enum CrawlerTypes {
  webtoon = 'webtoon',
  mangadex = 'mangadex'
}

interface ICrawlTarget {
  crawlTargetId?: number;  // identifier, primary
  name: string;  // human readable identifier
  url: string;  // The place to search
  adapter: CrawlerTypes; // The strategy to use to find the information when crawling
  lastCrawledOn: Date | null; // The date of the latest crawl
  crawlSuccess: boolean | null; // Whether the latest crawl logged data
}

interface SQLCrawlTarget {
  crawl_target_id: number;
  name: string;
  url: string;
  adapter: CrawlerTypes;
  last_crawled_on: Date | null;
  crawl_success: boolean | null;
}

class CrawlTarget {
  private data: ICrawlTarget;

  public constructor(data: ICrawlTarget) {
    this.data = data
  }

  public static fromSQL(data: SQLCrawlTarget) {
    return new this({
      crawlTargetId: data.crawl_target_id,
      name: data.name,
      url: data.url,
      adapter: data.adapter,
      lastCrawledOn: data.last_crawled_on,
      crawlSuccess: data.crawl_success
    })
  }

  public getObject(): ICrawlTarget {
    return this.data
  }

  public async insert(): Promise<QueryResult<SQLCrawlTarget>> {
    if (this.data.crawlTargetId) {
      console.log('This crawl target seems to have an id, did you mean to update instead?')

      throw new Error('Tried to insert data with an id into a serial column')
    }

    const db = await Database.getInstance()

    return await db.query({
      text: 'INSERT INTO crawl_target (name, url, adapter, last_crawled_on, crawl_success) VALUES ($1, $2, $3, $4, $5) RETURNING *;',
      values: [
        this.data.name,
        this.data.url,
        this.data.adapter,
        this.data.lastCrawledOn,
        this.data.crawlSuccess
      ]
    })
  }
}

export {
  CrawlTarget,
  CrawlerTypes,
  ICrawlTarget,
  SQLCrawlTarget
}