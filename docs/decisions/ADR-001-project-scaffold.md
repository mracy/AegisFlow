# ADR-001: Project Scaffold

## Status

Accepted

## Context

The AegisFlow repository needed a baseline structure before any implementation could begin. The exact language stack and deployment target were still under discussion.

## Decision

Create a language-agnostic top-level layout with Node.js-based package placeholders, leaving the agent runtime and database choices to a future task.

## Consequences

- The backend language can be decided in the next task (Fastify/Node or FastAPI/Python).
- `README.md`, `.env.example`, and `docker-compose.yml` provide a starting point for local development.
- `.gitkeep` files preserve the planned directory tree.
