CREATE TABLE users (
  user_id INT GENERATED ALWAYS AS IDENTITY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  lockout BOOLEAN NOT NULL,
  PRIMARY KEY(user_id)
);