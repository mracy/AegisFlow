# AegisFlow Local Setup Guide

This guide explains how to run the AegisFlow stack locally with Docker Compose.

## Prerequisites

- Docker Desktop (or equivalent Docker engine) installed and running.
- Docker Compose available in the Docker installation.
- `git` (optional, for cloning).

## 1. Clone the repository

```powershell
git clone <repo-url>
cd "AegisFlow"
```

## 2. Environment file (optional for local Docker)

No `.env` file is required for the local Docker run. If you want to add real cloud values later, copy the example:

```powershell
copy .env.example .env
```

Fill in real values only if you are connecting to Google Cloud or adding Pub/Sub.

## 3. Build the images

Build the API, web, and orchestrator images once.

```powershell
docker compose build api web orchestrator
```

## 4. Start the services

Start the API, web, PostgreSQL, and Redis containers.

```powershell
docker compose up -d api web
```

This command also starts `postgres` and `redis` because the API depends on them. The `orchestrator` service is one-shot; run it manually when needed.

## 5. Verify the stack

List the running containers:

```powershell
docker compose ps
```

You should see `api`, `web`, `postgres`, and `redis` as `Up`.

## 6. Open the services

- Frontend: `http://localhost:3000`
- API health: `http://localhost:3001/health`
- Swagger UI: `http://localhost:3001/documentation`

## 7. Seed demo data

Run the demo seed script to populate the in-memory API store with a workflow, candidate, jobs, and application.

```powershell
python scripts/seed_demo_data.py
```

## 8. Run the orchestrator stub (one-shot)

```powershell
docker compose run --rm orchestrator python main.py "Find software engineering jobs"
```

Or to use the discovery stub:

```powershell
docker compose run --rm orchestrator python main.py discover "Find software engineering jobs"
```

## 9. View logs

```powershell
docker compose logs -f api
```

## 10. Stop the stack

```powershell
docker compose down
```

## 11. Known warnings

- `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, and `GEMINI_MODEL` are optional for the local stub. The orchestrator does not make real Gemini calls yet.
- `docker-compose.yml` contains a `version: "3.8"` field that Compose reports as obsolete. This does not stop the stack from running.

## 12. Common issues

- **Docker not running**: If you see an error like `open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified`, start Docker Desktop first.
- **Port already in use**: Make sure ports `3000`, `3001`, `5432`, and `6379` are free.
