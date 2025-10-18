# Overview

This is a personal portfolio website ("yrizzme") that showcases information about Yahya Rizmi. The application is built with a modern full-stack architecture featuring:

- A simple static frontend (HTML/CSS/JS) served through Vite
- An Express.js backend server with TypeScript
- PostgreSQL database integration via Drizzle ORM
- Replit-based OAuth authentication system
- Session management with persistent database storage

The site displays personal information, interests, and social links while providing secure user authentication capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Technology Stack**: Vanilla HTML, CSS, and JavaScript with Vite as the build tool and development server.

**Design Decision**: Use a simple static site approach with minimal JavaScript for authentication status checking. This provides fast page loads and straightforward development while Vite handles hot module reloading during development.

**Key Features**:
- Client-side authentication status display (loading → logged in/out states)
- Fetch-based API communication to check user authentication
- Responsive styling with system fonts

## Backend Architecture

**Technology Stack**: Express.js server running via `tsx` (TypeScript execution) with ViteExpress integration.

**Design Decision**: Combine Express for API routes with ViteExpress to serve both the static frontend and backend API from a single server process. This simplifies deployment and development workflow.

**Server Structure**:
- Entry point: `server/index.ts` initializes Express and registers routes
- Route registration: `server/routes.ts` defines API endpoints
- Middleware: JSON parsing, URL encoding, session management, and Passport authentication

**Authentication Flow**:
- Uses Passport.js with OpenID Connect (OIDC) strategy
- Integrates with Replit's authentication service as the identity provider
- Protected routes use `isAuthenticated` middleware
- User sessions persist across server restarts via database-backed session store

## Data Storage

**Database**: PostgreSQL via Drizzle ORM

**Design Decision**: Use Drizzle ORM for type-safe database operations with PostgreSQL dialect. This provides excellent TypeScript integration and straightforward schema management.

**Schema Design** (`shared/schema.ts`):
- **sessions table**: Stores Express session data (sid, sess JSON, expire timestamp)
  - Indexed on `expire` for efficient session cleanup
- **users table**: Stores authenticated user profiles
  - Fields: id (UUID), email, firstName, lastName, profileImageUrl, timestamps
  - Email is unique to prevent duplicate accounts

**Database Client**: Uses `postgres` library for connection pooling and query execution.

**Migration Strategy**: Drizzle Kit handles schema generation and database pushes via npm scripts (`db:generate`, `db:push`).

## Session Management

**Implementation**: `express-session` with `connect-pg-simple` adapter

**Design Decision**: Store sessions in PostgreSQL rather than in-memory to support:
- Persistence across server restarts
- Horizontal scaling capability (multiple server instances sharing session state)
- 7-day session TTL (time-to-live)

**Security Configuration**:
- HTTP-only cookies prevent XSS attacks
- Secure flag enabled in production
- Session secret from environment variable
- No session initialization for unauthenticated users (saveUninitialized: false)

## Storage Layer

**Pattern**: Repository pattern via `DatabaseStorage` class implementing `IStorage` interface

**Design Decision**: Abstract database operations behind an interface to:
- Enable easy testing with mock implementations
- Centralize database logic
- Provide clear contracts for data operations

**Operations**:
- `getUser(id)`: Retrieve user by ID
- `upsertUser(userData)`: Insert new user or update existing on conflict (idempotent)

# External Dependencies

## Authentication Provider

**Service**: Replit OpenID Connect (OIDC)
- **Endpoint**: `https://replit.com/oidc` (configurable via `ISSUER_URL`)
- **Integration**: `openid-client` library with Passport strategy
- **Configuration**: Requires `REPL_ID` environment variable
- **Token Management**: Uses memoization (1-hour cache) for OIDC configuration to reduce discovery requests

## Database

**Service**: PostgreSQL
- **Connection**: Via `DATABASE_URL` environment variable
- **ORM**: Drizzle ORM with `drizzle-orm/postgres-js` driver
- **Schema Location**: `shared/schema.ts`
- **Migration Output**: `drizzle/` directory

## Required Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `REPL_ID`: Replit application identifier for OIDC
- `SESSION_SECRET`: Secret key for signing session cookies
- `REPLIT_DOMAINS`: Allowed domains for Replit environment
- `ISSUER_URL` (optional): OIDC issuer URL (defaults to Replit)
- `NODE_ENV`: Environment mode (affects cookie security settings)

## Build & Development Tools

- **Vite**: Frontend build tool and dev server with HMR enabled
- **tsx**: TypeScript execution for running the server without compilation
- **TypeScript**: Type checking and compilation (target: ES2020)
- **Drizzle Kit**: Database migration tooling

## NPM Packages

**Core Dependencies**:
- `express` (v5.1.0): Web framework
- `vite-express`: Integration layer between Vite and Express
- `passport`: Authentication middleware
- `openid-client`: OIDC client implementation
- `drizzle-orm`: Database ORM
- `postgres`: PostgreSQL client
- `express-session`: Session middleware
- `connect-pg-simple`: PostgreSQL session store
- `memoizee`: Function result caching

**Development Dependencies**:
- Various `@types/*` packages for TypeScript definitions
- `drizzle-kit`: Schema management CLI