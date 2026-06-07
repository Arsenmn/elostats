# Repository Guidelines

## Product Context

EloStats is a fullstack analytics app for CS2 players, built around FACEIT and Steam data. The product should help users search public players, inspect FACEIT/Steam profiles, analyze stats and match history, compare players, identify strengths and weaknesses, and review championship or tournament performance.

Longer-term features include AI-assisted analysis through OpenAI APIs, such as comparing two or more players, summarizing player form, explaining weaknesses, highlighting standout strengths, and generating actionable insights from FACEIT, Steam, match, and championship data. Keep architecture extensible for aggregated data pipelines, comparison workflows, and future AI analysis services rather than hardcoding one-off page fetches.

## Architecture Expectations

Treat this codebase as a multi-developer production project. Apply SOLID principles and keep responsibilities separated. Use a classic component-oriented React architecture with domain modules for larger product areas; do not drift into FSD unless the whole project is intentionally migrated to it.

Frontend conventions:

- `pages/` contains route-level components. Pages may own route params, loading/error states, page-level layout, and composition of a module's sections.
- `components/` contains shared app-level UI used across domains, such as header, auth form fields, and generic controls.
- `modules/<domain>/` contains cohesive product areas that have multiple components, hooks, local helpers, or local constants. Examples: `modules/player-profile`, `modules/player-search`, future `modules/player-compare`, `modules/championship-analysis`, and `modules/ai-analysis`.
- Inside a module, use `components/` for React components and `lib/` for non-React helpers, formatters, constants, and data extraction logic. Do not put non-component utilities in generic component folders.
- `api/` contains backend API clients and external boundary calls from the frontend. `types/` contains shared frontend TypeScript contracts. `hooks/` contains reusable app-level hooks.

Avoid artificial layers that only pass props through or wrap markup without meaningful reuse. Keep small one-use helpers local to their owning file. Extract components when they represent a meaningful UI section, are reused, or make a large page materially easier to review. Backend modules should expose clear service boundaries around external providers like FACEIT, Steam, and OpenAI, keeping API keys server-side and returning stable typed DTOs to the frontend.

## Project Structure & Module Organization

This repository contains a NestJS backend and a Vite React frontend.

- `backend/src/` contains Nest modules, controllers, services, DTOs, and guards.
- `backend/prisma/` contains the Prisma schema and migrations.
- `backend/test/` contains e2e tests; backend unit tests use `*.spec.ts` under `backend/src/`.
- `frontend/src/` contains React pages, routes, providers, hooks, components, API clients, types, and styles.
- `frontend/public/` contains static assets served by Vite.
- Root `Makefile` provides local environment and Prisma helpers.

## Build, Test, and Development Commands

Run commands from the repository root unless noted.

- `make env-up` starts the Postgres Docker service.
- `make env-down` stops the Docker environment.
- `make prisma-generate` regenerates Prisma client files.
- `make prisma-migrate` runs development database migrations.
- `make backend-dev` stops anything on port `3000`, then starts Nest in watch mode.
- `make frontend-dev` starts the Vite dev server.
- `cd backend && npm run build` builds the Nest backend.
- `cd frontend && npm run build` type-checks and builds the frontend.
- `cd backend && npm test` runs Jest unit tests.
- `cd backend && npm run test:e2e` runs backend e2e tests.

## Coding Style & Naming Conventions

Use TypeScript throughout. Follow existing Nest naming patterns: `*.module.ts`, `*.controller.ts`, `*.service.ts`, and DTOs under `dto/`. React components use PascalCase filenames such as `HomePage.tsx`; hooks use `useX.hook.ts`.

Backend formatting is handled by Prettier via `cd backend && npm run format`. Lint with `npm run lint` in each app. Prefer typed API responses and DTO validation over ad hoc object shapes.

## Testing Guidelines

Backend tests use Jest and `ts-jest`. Name unit tests `*.spec.ts` near the code they cover. Place e2e tests in `backend/test/` and run them with `npm run test:e2e`. Add focused tests for auth, API integration, and service error handling when behavior changes.

The frontend currently has build/lint checks but no test runner configured; verify UI changes with `cd frontend && npm run build`.

## Commit & Pull Request Guidelines

This repository has no commit history yet. Use clear, conventional-style messages such as `feat: add faceit player lookup` or `fix: refresh auth tokens`.

Pull requests should include a short summary, test/build commands run, linked issue if applicable, and screenshots for UI changes. Note any required env changes or migration steps.

## Security & Configuration Tips

Keep secrets in env files and do not commit real API keys. Backend requires `DATABASE_URL`, `JWT_SECRET`, and `FACEIT_API_KEY`. Frontend reads `VITE_BACKEND_ADDR` from `frontend/.env`.

Completely ignore backend-fastapi folder at all, this is educational folder - I'm trying to rewrite current backend on another framework, so theres no need in your help. If i even ask you to make changes on fastapi backend of this project always ask me about should you make changes.
