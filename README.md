# EventFlow – Event Management Platform

EventFlow is the capstone MERN application for Week 8: an event management system with registration, ticketing, organizer dashboards, and attendee portals. The repository is organized as a monorepo with `backend`, `frontend`, and `docs` workspaces.

## Tech Stack

- **Backend:** Node.js 18, Express 5, TypeScript, MongoDB (Mongoose), Socket.io, BullMQ, Stripe SDK
- **Frontend:** React 18 + Vite + TypeScript, Tailwind CSS, Redux Toolkit
- **Tooling:** Jest, Supertest, Playwright (planned), GitHub Actions, Render/Vercel deployments

## Repository Structure

```
.
├── backend        # Express API + real-time + workers
├── frontend       # React SPA + attendee/organizer views
├── docs           # API reference, architecture notes, user guides
└── Week8-Assignment.md
```

## Prerequisites

- Node.js ≥ 18
- npm ≥ 10
- MongoDB Atlas URI (or local instance)
- Redis URL (for queues, optional during local dev)
- Stripe test key (optional until checkout is wired)

## Environment Variables

Create `backend/.env` with:

```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/eventflow
CLIENT_URL=http://localhost:5173
JWT_ACCESS_SECRET=replace-with-32-char-secret
JWT_REFRESH_SECRET=replace-with-32-char-refresh-secret
STRIPE_SECRET_KEY=sk_test_xxx
REDIS_URL=redis://localhost:6379
```

## Backend – API Server

```bash
cd backend
npm install
npm run dev
```

Key endpoints (all prefixed with `/api/v1`):

- `GET /health` – service heartbeat
- `POST /auth/register` – create attendee/organizer
- `POST /auth/login` – obtain JWT + cookies
- `GET /events` / `GET /events/:eventId` – public catalogue
- `POST /events` – organizer creates draft event
- `POST /events/:eventId/publish` – publish event
- `POST /orders` – attendee purchases tickets
- `GET /orders/me` – attendee order history

## Frontend – Vite + React

```bash
cd frontend
npm install
npm run dev
```

The landing page currently renders a marketing overview and mocked event cards. Upcoming tasks will connect it to the live API, add authentication, and build organizer/attendee dashboards.

## Documentation & Deliverables

- `Week8-Assignment.md` – detailed requirements
- `docs/` – living documentation (API, user guide, architecture)
- Final submission will include deployment links, test coverage, and a recorded walkthrough per assignment instructions.