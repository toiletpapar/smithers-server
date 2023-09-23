CREATE TABLE crawl_target (
  crawl_target_id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  adapter crawler_types NOT NULL,
  last_crawled_on TIMESTAMPTZ,
  crawl_success BOOLEAN,
  user_id INT NOT NULL,
  cover_image BYTEA,
  cover_format image_types,
  cover_signature BYTEA,
  favourite BOOLEAN NOT NULL,
  PRIMARY KEY(crawl_target_id),
  UNIQUE(name, user_id),
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id)
      REFERENCES users(user_id)
      ON DELETE CASCADE
);