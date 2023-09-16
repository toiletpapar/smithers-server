CREATE TABLE logs (
  log_id INT GENERATED ALWAYS AS IDENTITY,
  log_type log_types NOT NULL,
  explanation TEXT NOT NULL,
  info json NOT NULL,
  logged_on TIMESTAMPTZ NOT NULL,
  PRIMARY KEY(log_id)
);