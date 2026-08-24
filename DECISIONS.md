# Decisions

## 2026-08-22 — Project scaffold only

- **Decision:** Create an implementation-agnostic scaffold before choosing the stack.
- **Alternatives considered:** Starting directly with FastAPI Python or Fastify Node backend.
- **Reason:** The user wants a safe loop and the exact stack was not locked.
- **Impact:** Backend/agent language can be decided in the next task without rework.

## 2026-08-22 — Fastify API + Python ADK orchestrator

- **Decision:** Use Fastify/Node for the public HTTP API and Python for the ADK agent runtime.
- **Alternatives considered:** FastAPI/Python for both; Fastify/Node for both.
- **Reason:** Google ADK is Python-native, while a TypeScript API aligns with the Node-based frontend monorepo and open-source tooling.
- **Impact:** The agent worker is decoupled from the API; they will communicate via Pub/Sub in a future task.

## 2026-08-22 — Docker-based local runtime

- **Decision:** Run the API and web in Docker using `node:20-slim` and the orchestrator in Docker using `python:3.12-slim`.
- **Alternatives considered:** Running directly on the host with `npm` and `python`.
- **Reason:** The user asked to run the stack in Docker and wants all dependencies pulled from the internet.
- **Impact:** Local development is now reproducible with `docker compose up -d api web`.

## 2026-08-22 — Merge ApplyFlow into AegisFlow

- **Decision:** Keep the Fastify/Node backend and Python orchestrator, and merge the ApplyFlow job-application domain on top of the existing AegisFlow mission engine.
- **Alternatives considered:** Pivoting the entire backend to FastAPI/Python for a pure ApplyFlow implementation.
- **Reason:** The user requested a merge, keeping the existing working stack while adding the ApplyFlow workflow, jobs, candidates, and applications concepts.
- **Impact:** The project now supports both generic mission workflows and ApplyFlow-style job search/application tracking.

## 2026-08-22 — Swagger and seed for Continuous Action Engine

- **Decision:** Add `@fastify/swagger-ui` to the Fastify API for an interactive API dashboard and a Python seed script to pre-populate in-memory demo data.
- **Alternatives considered:** Using a separate OpenAPI spec file, seeding directly into PostgreSQL.
- **Reason:** The user requested a Swagger UI with payload examples and a runnable seed file for the demo. Keeping the data in the existing in-memory store avoids new database integration.
- **Impact:** The API now ships with an interactive spec and a reproducible demo dataset, supporting the Continuous Action Engine narrative.
