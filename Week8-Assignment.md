# 🏆 Week 8: Capstone Project and Presentation – Bringing Your MERN Skills Together

## 🚀 Objective
Design, develop, and deploy **EventFlow**, an event management platform with attendee registration and ticketing that showcases advanced MERN skills: schema design, RESTful APIs, authentication, real-time updates, testing, CI/CD, and production deployment.

### 🎯 Problem Statement
Organizers struggle to manage event logistics across multiple tools (forms, spreadsheets, email). Attendees expect instant confirmation, mobile tickets, and live status. EventFlow unifies scheduling, registration, ticketing, check-in, and notifications with a modern UX.

### 👥 Personas & Goals
- **Organizer (primary)**: publishes events, sets ticket tiers/capacity, monitors sales, scans tickets on event day.
- **Attendee (secondary)**: browses events, registers/pay, stores tickets, receives reminders.
- **Staff (secondary)**: scans QR tickets, views capacity, handles transfers.

### 🌟 Core Features
- Public event catalog with search, filtering, and category tags
- Organizer dashboard for CRUD on events, ticket tiers, and promo codes
- Secure checkout flow with seat/quantity selection and payment stub integration (Stripe test mode)
- Personalized attendee portal with tickets, QR codes, and transfer/cancellation requests
- Real-time inventory updates and waitlist notifications via Socket.io + Web Push
- Admin analytics (sales, attendance, revenue) with downloadable CSV reports

## 📂 Tasks

### Task 1: Project Planning and Design
- **Project scope**: MVP covers event discovery, registration, ticket issuance, QR check-in, notifications; stretch goals include sponsorship management and onsite kiosk mode.
- **Wireframes**: low-fidelity flows in Figma (Home, Event detail, Checkout, Organizer dashboard, Check-in tablet). High-fidelity pass after component inventory.
- **Database schema**:
  - `users` (roles: attendee, organizer, admin, staff) with OAuth provider hooks
  - `organizations` (branding, staff list)
  - `events` (schedule, venue, capacity, status, ticket tiers, waitlist)
  - `tickets` (tier, price, QR token, status history)
  - `orders` (line items, total, payment intent, promo code usage)
  - `notifications` and `auditLogs`
  - Use referencing for relationships; embed lightweight arrays (e.g., tiers) inside `events`.
- **API design**: REST-first with versioned prefix `/api/v1`. Key resources: events, tickets, orders, attendees, check-ins, notifications. Document with OpenAPI and publish via Redoc.
- **Data flow**: Organizer UI → protected routes → BFF (Express) → services (EventsService, TicketingService). Background workers for waitlist promotions and reminder emails via BullMQ + Redis.
- **Roadmap**:
  1. Week 8.1: finalize UX, schema, automation pipeline
  2. Week 8.2: core backend (auth, events, ticket tiers)
  3. Week 8.3: checkout + attendee portal + Socket.io
  4. Week 8.4: testing, polish, deploy, record demo
- **Architecture decisions**: document ADRs for auth (JWT + refresh + HTTP-only cookies), payment handling (Stripe), real-time (Socket.io namespaces for event rooms), and CI/CD stack (GitHub Actions + Render).

### Task 2: Backend Development
- **Tech stack**: Node 18, Express 5, TypeScript, Mongoose, Zod validators, Stripe SDK, BullMQ, Socket.io, Redis (for queues + rate limiting).
- **Schemas**: leverage discriminators for different ticket types (general admission vs. seat map). Enforce per-event capacity with MongoDB transactions.
- **Auth & RBAC**: JWT access/refresh stored in HTTP-only cookies; Passport for Google login. Middleware enforces roles (`organizer`, `staff`, `admin`). Device/session tracking for suspicious logins.
- **APIs**:
  - Public: list events, detail page, availability polling
  - Authenticated attendee: create order, manage tickets, download QR (signed URL)
  - Organizer: CRUD events, ticket tiers, promo codes, exports, invite staff
  - Staff: check-in endpoint updates ticket status + emits Socket event
- **Middleware**: request logging (pino), input validation (celebrate/zod), helmet + cors, rate limiting keyed by route + IP, centralized error handler with Problem Details spec.
- **Real-time**: Socket.io namespace per event for ticket inventory updates and check-in notifications; server emits `inventory:update` when orders complete or cancel.
- **Testing**: Jest + supertest for controllers, MSW for Stripe mocks, MongoDB Memory Server for integration, contract tests for critical endpoints. Coverage target 85% statements.

### Task 3: Frontend Development
- **Tech stack**: React 18 + Vite, TypeScript, React Router 6.21, Redux Toolkit Query for data layer, Tailwind + Radix UI primitives, React Hook Form + Zod for forms.
- **Layouts**: separate shells for public catalog, attendee portal, organizer workspace (with sidebar nav), and kiosk check-in mode supporting touch interactions.
- **Components**: event cards, tier selector with live availability, checkout wizard, QR wallet, analytics charts (Nivo), ticket scanner (WebRTC or manual code input).
- **State/data**: RTK Query handles caching and optimistic updates. Real-time hooks subscribe to Socket.io channels for `inventory:update`, `checkin:update`, and waitlist promotions.
- **UX details**: multi-step forms with progress indicators, accessible modals/dialogs, skeleton loaders, inline error toasts. Offline-ready ticket wallet using Service Worker caching.
- **Validation**: client + server parity via shared Zod schemas (published as npm workspace package).

### Task 4: Testing and Quality Assurance
- **Unit tests**: Jest + React Testing Library for UI, vitest for hooks. Focus on tier selection logic, price calculations, countdown timers.
- **API integration**: supertest suites for all CRUD + checkout flows, covering edge cases (capacity full, duplicate scans, payment fails).
- **E2E**: Playwright tests for attendee purchase, organizer publishing, staff check-in. Run headless in CI with seeded data.
- **Manual QA**: responsive tests on Chrome, Firefox, Safari, Edge, plus Android/iOS via browserstack. Accessibility audits with axe DevTools & manual keyboard passes.
- **Code reviews**: PR template with checklist (tests, docs, screenshots). Scheduled refactor pass for shared hooks and UI primitives.
- **Observability**: enable request tracing, structured logs, and synthetic uptime checks even in staging.

### Task 5: Deployment and Documentation
- **Hosting**: Backend on Render (auto deploy main → production, preview env per PR). Frontend on Vercel with environment sync. MongoDB Atlas + Redis Cloud.
- **CI/CD**: GitHub Actions pipeline: lint → typecheck → unit/integration tests → Playwright (on preview) → deploy. Use Git hooks (Husky) for pre-commit lint/test.
- **Monitoring**: Sentry for frontend/backend errors, Logtail for logs, UptimeRobot pings, Stripe webhook alerts to Slack.
- **Docs**:
  - Root `README`: architecture diagram, features, setup, .env template, links to deployments and Loom demo.
  - `/docs/api.md`: OpenAPI summary + example requests.
  - `/docs/user-guide.md`: organizer + attendee walk-through with screenshots.
  - `/docs/architecture.md`: sequence diagrams, data model ERD, ADR links.
- **Presentation**: 8-slide deck covering problem, personas, feature demo, architecture, dev process, testing, metrics, and roadmap. Include 90-second live demo recording + backup video.

## 🧪 Expected Outcome
- Production-ready EventFlow instance with organizer and attendee roles demo-ready.
- GitHub repository containing backend, frontend, worker, and docs workspaces with comprehensive commit history.
- Automated CI/CD pipeline with green test suite, coverage reports, and deploy logs.
- Live Vercel/Render URLs plus Loom walkthrough and screenshots referenced in `README`.
- Slide deck + recorded presentation highlighting registration/ticketing flow, real-time updates, and architecture trade-offs.

## 🛠️ Project Ideas (Optional)
Here are some project ideas you can consider:
- E-commerce platform with product catalog, cart, and checkout
- Task/project management system with team collaboration
- Social media platform with posts, comments, and real-time notifications
- Learning management system with courses, lessons, and progress tracking
- Health and fitness tracker with data visualization
- Recipe sharing platform with search and filtering
- Job board with application tracking
- Event management system with registration and ticketing

Feel free to come up with your own idea that demonstrates your skills and interests!

## ✅ Submission Instructions
1. Accept the GitHub Classroom assignment invitation
2. Clone your personal repository that was created by GitHub Classroom
3. Develop your capstone project within this repository
4. Commit and push your code regularly to show progress
5. Include in your repository:
   - Complete source code for both frontend and backend
   - Documentation in the form of README files
   - Tests and CI/CD configuration
6. Deploy your application and ensure it's accessible online
7. Update your main README.md with:
   - A description of your project
   - Setup instructions
   - Link to the deployed application
   - Link to a 5-10 minute video demonstration
   - Screenshots of key features
8. Your final submission will be automatically graded based on the criteria in the autograding configuration
9. The instructor will review your complete project after the final push 