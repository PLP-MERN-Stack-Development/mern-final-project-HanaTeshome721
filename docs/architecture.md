# EventFlow Architecture Snapshot

## High-Level Overview
- **Frontend**: Vite + React + TypeScript, Tailwind UI kit, Redux Toolkit Query (future) for API caching, Socket.io client for real-time signals.
- **Backend**: Express 5 + TypeScript with modular services, MongoDB (Atlas) via Mongoose, Redis-backed BullMQ workers, Socket.io, Stripe test webhooks.
- **Infra**: Render (API + workers) and Vercel (frontend), MongoDB Atlas cluster, Redis Cloud instance, GitHub Actions for CI/CD.

## Modules
1. **Public Discovery**: event catalog, search, detail pages.
2. **Registration**: ticket tier selection, checkout, confirmations.
3. **Attendee Wallet**: tickets, QR codes, transfers.
4. **Organizer Workspace**: CRUD events, analytics, staff invites.
5. **Onsite Ops**: Scan/validation, occupancy dashboards, waitlist promotions.

## Data Pipelines
- Commands validated with Zod on both client and server.
- Orders create payment intents â†’ upon webhook confirmation, tickets minted & Socket inventory events fired.
- BullMQ queues manage reminder emails, waitlist auto-promotions, and reconciliation jobs.

## Observability
- Pino structured logs + Logtail shipping.
- Sentry for FE/BE error tracking.
- Synthetic uptime monitors hitting /health and /api/v1/health.

This document will evolve with ERDs, sequence diagrams, and ADR references as implementation progresses.
