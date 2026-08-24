# Changelog

## 2026-08-22

### Added

- Initial AegisFlow repository scaffold.
- Top-level package configuration, `.env.example`, and `docker-compose.yml`.
- `apps/web` and `apps/api` placeholder packages.
- `docs/architecture` and `docs/decisions` with an ADR for the scaffold.
- Required loop documentation: `TASK_LOG.md`, `PROJECT_KNOWLEDGE.md`, `DECISIONS.md`, `CHANGELOG.md`, `ERROR_LOG.md`.
- Fastify API with mission endpoints and in-memory store.
- Next.js dashboard page for submitting missions.
- Python ADK orchestrator stub with Docker packaging.
- `apps/api/Dockerfile` and `apps/web/Dockerfile`.
- Updated `docker-compose.yml` with `api`, `web`, and `orchestrator` services.
- `NEXT_PUBLIC_API_URL` for cross-origin frontend configuration.
- ApplyFlow `Workflow`, `Job`, `Candidate`, and `Application` domain in `apps/api/src/applyflow.ts`.
- `/workflows`, `/jobs`, `/candidates`, and `/applications` API endpoints.
- Dashboard updated to submit job-search workflows and show the application pipeline.
- Stub `Discovery Agent` in `agents/orchestrator/main.py`.
- `@fastify/swagger` and `@fastify/swagger-ui` with OpenAPI spec and interactive UI at `/documentation`.
- Request/response payload examples for `POST /missions`, `POST /workflows`, `POST /jobs`, `POST /candidates`, and `POST /applications`.
- `scripts/seed_demo_data.py` to populate the in-memory API store with a workflow, candidate, jobs, and application.
- `400` and `404` response examples in the OpenAPI schemas for all routes that return those statuses.
- Root `.gitignore` to exclude `node_modules`, `package-lock.json`, build artifacts, and environment files.
