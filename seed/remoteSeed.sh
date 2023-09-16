echo "Reaching remote for data..."
pg_dump --host=localhost --port=62142 --username=developer --clean --create budget | psql -h localhost -p 5432 -d postgres -U developer
