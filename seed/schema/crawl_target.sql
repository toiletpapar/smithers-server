CREATE TABLE crawl_target (
  crawl_target_id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  adapter crawler_types NOT NULL,
  last_crawled_on TIMESTAMPTZ,
  crawl_success BOOLEAN,
  PRIMARY KEY(crawl_target_id)
);