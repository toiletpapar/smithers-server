CREATE TABLE manga_update (
  manga_update_id INT GENERATED ALWAYS AS IDENTITY,
  crawl_target_id INT NOT NULL,
  crawled_on TIMESTAMPTZ NOT NULL,
  date_created TIMESTAMPTZ NOT NULL,
  chapter NUMERIC(5,1) NOT NULL,
  chapter_name TEXT,
  is_read BOOLEAN NOT NULL,
  read_at TEXT NOT NULL,
  PRIMARY KEY(manga_update_id),
  UNIQUE(crawl_target_id, chapter),
  CONSTRAINT fk_crawl_target
    FOREIGN KEY(crawl_target_id)
      REFERENCES crawl_target(crawl_target_id)
      ON DELETE CASCADE
);