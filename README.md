# **Travel Friends – Collaborative Trip Planning API**

Travel Friends is a backend service that helps groups plan trips together by creating shared itineraries, inviting friends, and confirming participation via email‑driven workflows.

It is built as a small but production‑minded TypeScript/Fastify/Prisma codebase that showcases API design, data modeling, and clean backend architecture for a real‑world feature set.

## **High‑level architecture**

The application is a Node.js backend written in TypeScript and organized into three main layers:

- **HTTP layer (Fastify)**
    - `src/server.ts` boots a Fastify application, registers the route modules, and configures JSON parsing and validation.
    - Route handlers live under `src/routes`, one file per use case (e.g., `create-trip.ts`, `confirm-trip.ts`).
- **Domain and persistence layer (Prisma)**
    - Prisma is configured under `prisma/` with `schema.prisma`, migrations, and a local SQLite database (`dev.db`) for development.
    - Models capture the core entities for trip planning: trips, participants, and their relationships over time.
- **Shared utilities (`src/lib`)**
    - Common infrastructure concerns (Prisma client, helpers, email integration hooks) are grouped under `src/lib` to keep route files focused on behavior.

The stack at a glance:

| **Concern** | **Technology** |
| --- | --- |
| Runtime | Node.js + TypeScript |
| Web server | Fastify |
| Validation | Zod (Fastify type provider) |
| ORM | Prisma |
| Database | SQLite (dev) via Prisma |
| Build/Types | `tsconfig.json` with strict TypeScript configuration |

These choices are visible in `package.json` and `tsconfig.json`, where the project is configured as a TypeScript‑first Node.js service with Prisma and Fastify dependencies.

## **Core features and domain model**

At its core, Travel Friends aims to solve “who is going, when, and where?” for group trips.

The current feature set focuses on the core lifecycle of a trip:

- **Trip creation** (`POST /trips`)
    - Create a new trip with destination and date range.
    - Attach participants (friends) to the trip at creation time via their email addresses.
    - Persist all entities in the relational schema via Prisma.
- **Trip confirmation flow** (`POST /trips/:id/confirm`)
    - Allow invitees to confirm their participation through a dedicated endpoint.
    - Mark the participant’s status in the database, enabling downstream features like reminders, group chat, or cost splitting.
- **Email‑ready workflow**
    - The project includes routes and structures anticipating dynamic email responses tied to trip confirmation.
    - This demonstrates how APIs can be designed around asynchronous user actions coming from outside the primary UI.

## **Data model (Prisma)**

The Prisma schema under `prisma/schema.prisma` defines the relational structure of the app.

While you can inspect the full schema there, the key ideas are:

- A `Trip` entity that carries destination, start/end dates, and metadata.
- A `Participant` (or similar) entity linking people to trips, with fields for email, name, and confirmation status.
- Migration files under `prisma/migrations/` that document the evolution of the schema and support reproducible environments.

This is a realistic foundation for extending into richer group‑travel features such as expense sharing, itinerary items, and collaborative editing.

## **Technical highlights**

## **Type‑safe HTTP API with Fastify + Zod**

- Fastify is used as the HTTP framework, chosen for performance and first‑class TypeScript support.
- Request and response bodies are validated with Zod via the Fastify type provider, ensuring runtime validation and compile‑time types for handlers.
- Each route file (`create-trip.ts`, `confirm-trip.ts`) encapsulates the schema, handler, and registration with the server.

This combination makes it easy to evolve the API safely as requirements change.

## **Clean separation of concerns**

- `src/server.ts` is intentionally small: it wires up Fastify, registers route modules, and starts the server.
- Business rules live in route handlers and lib helpers, not in framework glue or controllers.
- Prisma access is encapsulated so that the rest of the code thinks in terms of domain operations rather than raw SQL.

This layout is designed to scale: adding features like “trip activities” or “cost sharing” requires only new models, migrations, and route modules.

## **Database and migrations with Prisma**

- Prisma provides the schema definition (`schema.prisma`), migrations, and an auto‑generated client.
- The repository includes `prisma/migrations/` and `prisma/dev.db`, showing the database in a realistic, versioned state.
- This setup allows `prisma migrate dev` to reproduce the schema from scratch, which is how I typically bootstrap local environments.

## **Tooling and configuration**

- TypeScript configuration is defined in `tsconfig.json`, with options suited for Node backend development.
- Dependencies and scripts are managed via `package.json`, with lockfile `package-lock.json` checked in to pin versions.
- `.gitignore` is configured to keep build artifacts and environment‑specific files out of version control.

## **Getting started**

Below is a simple local‑dev setup to run the API and experiment with the endpoints.

## **Prerequisites**

- Node.js (LTS recommended)
- npm
- SQLite (for inspecting `dev.db`, optional)

## **Install and run**

`bash# Clone the repository
git clone https://github.com/thbueno/travel-friends.git
cd travel-friends

# Install dependencies
npm install

# Apply Prisma migrations (if needed)
npx prisma migrate dev

# Start the development server
npm run dev    # or the appropriate script from package.json`

Once running, the Fastify server listens on the configured port (commonly 3333 or 3000; see `src/server.ts`).

## **Example API usage**

Using a tool like `curl` or HTTPie you can exercise the API (payloads will match the Zod schemas in the route files):

- Create a trip:

`bashcurl -X POST http://localhost:3333/trips \
  -H "Content-Type: application/json" \
  -d '{
    "destination": "Lisbon",
    "startsAt": "2026-07-01T00:00:00.000Z",
    "endsAt": "2026-07-10T00:00:00.000Z",
    "participants": [
      { "name": "Alice", "email": "alice@example.com" },
      { "name": "Bob", "email": "bob@example.com" }
    ]
  }'`

- Confirm a trip participation:

`bashcurl -X POST http://localhost:3333/trips/<tripId>/confirm \
  -H "Content-Type: application/json" \
  -d '{ "participantId": "<participantId>" }'`

Replace `tripId` and `participantId` with ids returned by the creation endpoint.

## **Roadmap and extension ideas**

This codebase is intentionally small but structured for growth.

If I were evolving it in a production setting, I would focus on:

- Authentication and authorization (e.g., user accounts, secure invite links).
- Richer trip modeling (activities, budgets, accommodations, transportation segments).
- Queue‑based email and notification delivery for confirmations and reminders.
- Observability: logging, metrics, and tracing for each route.
- Deployment configuration (Dockerfile, CI workflow, and cloud infrastructure definitions).

These are natural extensions that the current architecture can absorb without major refactors.
