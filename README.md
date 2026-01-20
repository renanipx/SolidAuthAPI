# SolidAuth API

Node.js/Express/TypeScript authentication API with JWT access tokens, refresh token rotation, RBAC (ADMIN/USER), rate limiting, Prisma/PostgreSQL, and Swagger docs.

## Features
- JWT access + refresh tokens (rotation on refresh)
- RBAC: ADMIN and USER roles
- Rate limiting on login and refresh endpoints
- Prisma ORM with PostgreSQL
- Centralized error handling and logging
- Swagger/OpenAPI docs at /docs
- Jest + Supertest test suite

## Quick Start
1) Install dependencies:
- npm install

2) Start PostgreSQL (Docker):
- docker-compose up -d (exposes Postgres on localhost:5433)

3) Environment (.env):
- DATABASE_URL (e.g., postgresql://postgres:postgres@localhost:5433/appdb?schema=public)
- JWT_SECRET
- (optional) JWT_EXPIRES_IN (e.g., 15m), REFRESH_TOKEN_EXPIRES_DAYS (e.g., 7)

4) Database migrate & seed:
- npx prisma migrate dev
- npx prisma db seed (creates ADMIN user: admin@admin.com / admin123)

5) Run dev server:
- npm run dev
- API: http://localhost:3333
- Swagger: http://localhost:3333/docs

## Scripts
- dev: development server (ts-node-dev)
- build: compile TypeScript to dist/
- start: run compiled build
- lint: ESLint
- test: Jest

## API Summary
- POST /auth/login → returns { accessToken, refreshToken } (401 on invalid credentials)
- POST /auth/refresh → returns new { accessToken, refreshToken } (400 missing token, 401 invalid)
- POST /users → create user (201 on success, 409 if email in use)
- GET /users/me → authenticated profile (JWT required)
- GET /users → ADMIN only (403 if not ADMIN)
- DELETE /users/:id → ADMIN only (403 if not ADMIN)

## Authentication
Send JWT via Authorization header: Bearer <token>.
Token payload includes sub (user id) and role (ADMIN|USER).

## Testing
- npm test (runs Jest + Supertest)

Notes:
- Store secrets securely; do not commit .env
- Adjust JWT_EXPIRES_IN and REFRESH_TOKEN_EXPIRES_DAYS per your security policy