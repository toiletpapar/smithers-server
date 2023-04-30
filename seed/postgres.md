Some quick starter templates and reminders for setting up new psql servers

* setup your PGDATA env variable for your data directory
* use `initdb`
* use `pg_ctl start/stop` to help manage your server
* modify authentication through pg_hba.conf
* setup users with:
```
CREATE DATABASE EXAMPLE_DB;
CREATE USER EXAMPLE_USER WITH ENCRYPTED PASSWORD 'Sup3rS3cret';
GRANT ALL PRIVILEGES ON DATABASE EXAMPLE_DB TO EXAMPLE_USER;
\c EXAMPLE_DB postgres
# You are now connected to database "EXAMPLE_DB" as user "postgres".
GRANT ALL ON SCHEMA public TO EXAMPLE_USER;
```
Adjusting privileges as required

See: https://stackoverflow.com/questions/67276391/why-am-i-getting-a-permission-denied-error-for-schema-public-on-pgadmin-4

