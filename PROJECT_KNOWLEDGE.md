# Project Knowledge — AegisFlow

## Project

- **Name:** AegisFlow — Autonomous Work Execution Network
- **Category:** Taskmaster (All Things Agentic Hackathon)
- **Goal:** Turn user objectives into autonomous, verifiable workflows using multi-agent orchestration.

## Conventions

- This project uses the Safe AI Development Loop.
- Only one small step is completed per task.
- Architecture and stack changes require human confirmation.
- All dependencies must be open source.
- Docker is used for local backing services.

## Open questions

- Backend language: Fastify (Node) vs. FastAPI (Python).
- Agent framework details: Google ADK version and deployment target.
- Whether to include additional Google models (Gemma, Veo, Lyria).

## 2026-08-22 — Core slice

- **Backend:** `apps/api` is a Fastify (Node/TypeScript) service with `/health`, `/missions` CRUD, and an in-memory store.
- **Agent runtime:** `agents/orchestrator` is a Python ADK placeholder with a planning stub and Docker packaging.
- **Frontend:** `apps/web` is a Next.js page that can submit missions and display status.
- **Open questions resolved for this slice:** Fastify/Node for the public API, Python for ADK agent workers. Deployment and persistent state remain open.

## 2026-08-22 — Docker

- `docker compose build` builds `api`, `web`, and `orchestrator`.
- `docker compose up -d api web` runs the API on `localhost:3001` and the web on `localhost:3000`.
- `docker compose run --rm orchestrator python main.py "<objective>"` runs the ADK stub.
- The API, web, and orchestrator images are all based on open-source base images (`node:20-slim` and `python:3.12-slim`).

## 2026-08-22 — ApplyFlow merge

- **ApplyFlow domain:** Workflows, Jobs, Candidates, and Applications are stored in memory in the Fastify API.
- **Endpoints:** `POST /workflows`, `GET /workflows/:id`, `POST /jobs`, `GET /jobs`, `POST /candidates`, `GET /candidates`, `POST /applications`, `GET /applications`.
- **Orchestrator:** `python main.py discover "<goal>"` runs a stub Discovery Agent that returns sample jobs.
- **Frontend:** The dashboard can post a job-search goal to `/workflows` and displays the application pipeline.

## 2026-08-22 — Swagger UI and seed

- **Swagger:** The API serves an OpenAPI 3.1 spec and Swagger UI at `http://localhost:3001/documentation`. All ApplyFlow endpoints include request/response examples.
- **Seed:** `python scripts/seed_demo_data.py` creates a workflow, a candidate, two jobs, and one application through the public API.
- **Demo data:** After seeding, `GET /workflows`, `GET /jobs`, and `GET /applications` return the seeded records, which can be shown in the Swagger UI "Try it out" interface.
