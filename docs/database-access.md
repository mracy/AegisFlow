# AegisFlow Database Access

This guide shows how to connect to the local PostgreSQL and Redis services that are started by Docker Compose.

## PostgreSQL

### Service details

- Host: `localhost`
- Port: `5432`
- Database: `aegisflow`
- User: `aegisflow`
- Password: `aegisflow`

### Access from inside the Docker network

```powershell
docker compose exec postgres psql -U aegisflow -d aegisflow
```

### Access from the host

If you have `psql` installed locally:

```powershell
psql -h localhost -p 5432 -U aegisflow -d aegisflow
```

When prompted, enter the password `aegisflow`.

### psql quick commands

```text
\l                  List databases
\dt                 List tables
\d table_name       Describe a table
\q                  Quit
```

### Connection string

```text
postgresql://aegisflow:aegisflow@localhost:5432/aegisflow
```

### Important note

The Fastify API currently stores workflows, jobs, candidates, and applications in memory. PostgreSQL is provisioned in `docker-compose.yml` for future persistence and is not yet used by the application logic.

## Redis

### Service details

- Host: `localhost`
- Port: `6379`

### Access with redis-cli

```powershell
docker compose exec redis redis-cli
```

### Common Redis commands

```text
PING                Test connectivity
KEYS *              List all keys (use carefully in production)
GET <key>           Get a key value
SET <key> <value>   Set a key value
```

### Connection URL

```text
redis://localhost:6379
```

## Wiping data

To remove the PostgreSQL data volume and start fresh:

```powershell
docker compose down -v
```

This deletes the `pgdata` volume. Redis data is ephemeral by default unless configured with a volume.
