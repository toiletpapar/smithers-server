/**
 * 
 * interface LatestMangaUpdate {
 *   _id*: string; // identifier, primary
 *   crawlId*: string; // the identifier of the crawler that produced the result, foreign
 *   crawledOn*: Date; // the date this update was logged
 *   chapter*: number; // number of the chapter
 *   chapterName: string; // name of the chapter
 *   readAt: string; // a link to read the chapter
 *   isRead*: boolean; // whether the user read the update, logged onClick
 * }
 */

import { Database } from '../database/Database'

enum CrawlerTypes {
  webtoon = 'webtoon',
  mangadex = 'mangadex'
}

interface ICrawlTarget {
  _id?: string;  // identifier, primary
  name: string;  // human readable identifier
  url: string;  // The place to search
  adapter: CrawlerTypes; // The strategy to use to find the information when crawling
  lastCrawledOn: Date | null; // The date of the latest crawl
  crawlSuccess: boolean | null; // Whether the latest crawl logged data
}

class CrawlTarget {
  private data: ICrawlTarget;

  public constructor(data: ICrawlTarget) {
    this.data = data
  }

  public getObject(): ICrawlTarget {
    return this.data
  }

  public async insert(): Promise<void> {
    if (this.data._id) {
      console.log('This crawl target seems to have an id, did you mean to update instead?')

      throw new Error('Tried to insert data with an id into a serial column')
    }

    const db = await Database.getInstance()

    await db.query({
      text: 'INSERT INTO crawl_target (name, url, adapter, lastCrawledOn, crawlSuccess) VALUES ($1, $2, $3, $4, $5);',
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
  CrawlerTypes
}