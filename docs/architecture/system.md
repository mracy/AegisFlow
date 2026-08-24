# AegisFlow Architecture

This document will hold the system architecture diagram and component descriptions once the stack is finalized.

For now, the planned layers are:

- Frontend: AI operations control center (Next.js / React / TypeScript)
- Backend: workflow management, request validation, and event publishing
- AI runtime: Google ADK multi-agent orchestration
- Memory: Firestore / PostgreSQL + pgvector for persistent and semantic memory
- Messaging: Google Cloud Pub/Sub for asynchronous task execution
- Runtime: Cloud Run services and jobs
- Observability: OpenTelemetry + open-source backend
