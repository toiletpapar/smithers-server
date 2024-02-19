echo "Reaching remote for data..."
pg_dump --host=localhost --port=62142 --username=postgres --clean --create postgres | psql -h localhost -p 5432 -d postgres -U postgres
