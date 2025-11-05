# Technology Stack and Dependencies

This document provides a concise technical overview of the project's technology stack, key dependencies, tooling, and how they fit together.

Last updated: 2025-11-05

## Overview
- Framework: Angular 20 (standalone, latest tooling)
- Language: TypeScript 5.9
- UI Toolkit: Angular Material 20 + Angular CDK
- State/Data:
  - RxJS 7 for reactive programming
  - @ngrx/signals 20 (NgRx Signals) for state with Angular Signals
  - @tanstack/angular-query-experimental 5 for server-state fetching/caching
- Styling: Tailwind CSS 4 (via @tailwindcss/postcss + PostCSS)
- Runtime Extras: zone.js 0.15, tslib 2.x
- SSR: @angular/ssr 20 (Angular Universal)
- E2E Testing: Playwright
- Dev Tooling: Angular CLI/Build, Prettier
- Sample API for local development: Bookmonkey API (via `npx bookmonkey-api`)

## Top-Level Scripts (package.json)
- `npm start`: Runs the dev server (`ng serve`) at http://localhost:4200
- `npm run start:api`: Starts the sample HTTP API using `npx bookmonkey-api` at http://localhost:4730
- `npm run build`: Production build (`ng build`)
- `npm run watch`: Rebuild on changes (`ng build --watch --configuration development`)
- `npm test`: Unit tests (`ng test`)
- `npm run format.write`: Format sources with Prettier

## Runtime Dependencies
From `package.json` → `dependencies`:
- `@angular/*` 20.2.x
  - `@angular/core`, `@angular/common`, `@angular/forms`, `@angular/router` – core framework packages
  - `@angular/platform-browser` – browser platform runtime
  - `@angular/platform-server` – server platform for SSR
  - `@angular/animations` – Angular animations engine
  - `@angular/material` + `@angular/cdk` – Material Design components and CDK utilities
  - `@angular/ssr` – Angular Universal SSR integration
- `@angular-architects/ngrx-toolkit` – utilities around NgRx/Signals for modern Angular architectures
- `@ngrx/signals` 20.0.1 – NgRx Signals state management built on Angular Signals
- `@tanstack/angular-query-experimental` ^5.85.5 – TanStack Query bindings for Angular
- `express` 5.1.0 – Minimal web framework often used by Angular Universal SSR server
- `rxjs` 7.8.0 – Reactive programming primitives
- `tslib` 2.3.0 – TS helper library used by compiled output
- `zone.js` 0.15.0 – Zone-based change detection support (still required by many Angular features)

## Development Dependencies
From `package.json` → `devDependencies`:
- Angular toolchain:
  - `@angular/cli` 20.2.0 – project scaffolding and dev server tasks
  - `@angular/build` 20.2.0 – builder and webpack/Esbuild integration
  - `@angular/compiler-cli` 20.2.1 – AOT compiler for builds and type-checking
- TypeScript and types:
  - `typescript` 5.9.2
  - `@types/node` ^20.17.19
  - `@types/express` ^5.0.1
- Styling:
  - `tailwindcss` 4.1.12
  - `@tailwindcss/postcss` 4.1.12
  - `postcss` 8.5.6
- Testing & Quality:
  - `@playwright/test` ^1.55.0 – E2E testing framework
  - `prettier` 3.6.2 – code formatting

## Testing & E2E
- Playwright is configured in `playwright.config.ts`:
  - Tests live in `./tests`
  - Projects for Chromium, Firefox, WebKit
  - Local dev server is auto-started via `npm start` and expected on `http://localhost:4200`
  - Trace collection on first retry
- Run: `npx playwright test` (or through your chosen script/runner). The repository also includes some examples under `tests-examples`.

## Server-Side Rendering (SSR)
- `@angular/ssr` and `@angular/platform-server` indicate SSR capability (Angular Universal).
- `express` 5 is included for hosting the SSR server when needed. Build/serve commands for SSR are typically configured via Angular CLI and `angular.json` (not all SSR commands may be wired into `package.json` yet).

## Styling (Tailwind CSS)
- Uses Tailwind CSS v4 with PostCSS integration (`@tailwindcss/postcss`). Tailwind config in v4 can be largely convention-based.
- Ensure PostCSS is part of the Angular build pipeline (via Angular build integration; no explicit config file is required for Tailwind v4 defaults).

## Project Configuration Files
- `angular.json` – Angular workspace and build configurations
- `tsconfig*.json` – TypeScript compiler settings
- `playwright.config.ts` – Playwright E2E settings, browsers, and local dev server integration
- `package.json` – scripts, dependencies, and tooling versions

## Local Development Flow
1. Install: `npm install`
2. Start API (optional sample backend): `npm run start:api` → http://localhost:4730
3. Start app: `npm start` → http://localhost:4200
4. Run unit tests: `npm test`
5. Run E2E tests: `npx playwright test`
6. Format: `npm run format.write`

## Notes
- The Bookmonkey API is invoked via `npx` and is not a local dependency; it downloads on first run.
- Version pins reflect the current state of `package.json` and may change over time.

## APIs

This project uses a local sample REST API named "Bookmonkey API" for development and workshop exercises.

- Base URL (local): `http://localhost:4730`
- How to start: `npm run start:api` (internally runs `npx bookmonkey-api`)
- CORS: Enabled by the sample server for local development
- Auth: Not required (public endpoints, no tokens)

### Books Resource
- Collection endpoint: `GET /books`
- Item endpoint: `GET /books/:id` (available in the sample server; not yet used by the app)
- Common query params supported by the sample server:
  - `_limit` — limits the number of returned items (e.g., `_limit=10`)
  - `q` — full-text search across common fields such as `title` and `author`

Example Request
```
GET http://localhost:4730/books?_limit=10&q=angular
```

Example Response (shape)
```
[
  {
    "id": "978000000001",
    "title": "Learning Angular",
    "author": "Jane Doe",
    "abstract": "Short description...",
    "cover": "https://.../cover.png"
  }
]
```

Error handling
- Network or server errors are surfaced to the browser console in the current UI.
- The sample app displays a loading spinner and hides the grid on error; you can add user-facing error messages as an enhancement.

Extending the API usage
- The sample API typically also supports `POST /books`, `PUT/PATCH /books/:id`, and `DELETE /books/:id` for CRUD, though the current UI only reads data.
- If you add details pages, you can call `GET /books/:id` using the same `HttpClient` service pattern.

### Where the API is consumed in the app
- Service: `src/app/books/book-api-client.service.ts`
  - Base endpoint used: `http://localhost:4730/books`
  - Method: `getBooks(pageSize: number = 10, searchTerm?: string)`
  - Implementation uses Angular `HttpClient` with `HttpParams` to pass `_limit` and `q`.
- Component: `src/app/books/book-list.component.ts`
  - Calls the service and subscribes to the Observable
  - Debounces search input (300 ms) to reduce request volume
  - Manages `loading` state and renders a basic empty-result state

Environment configuration
- The API URL is currently hard-coded in `BookApiClient` for simplicity during the workshop.
- For multi-environment setups, consider moving the base URL to an `environment.ts` file and use Angular build file replacements or runtime configuration.

---

## Application Architecture

High level
- App style: Modern Angular (standalone components, no NgModules)
- Routing: Configured via `provideRouter(routes)` in `app.config.ts`
- HTTP: Provided globally via `provideHttpClient()`
- Animations: `provideAnimations()` to enable Angular Material animations
- Change detection: `provideZoneChangeDetection({ eventCoalescing: true })`

Structure (key files)
- `src/app/app.ts` — Root component (`<app-root>`) hosting the router outlet
- `src/app/app.html` — Root template
- `src/app/app.config.ts` — Application-wide providers (router, HTTP, animations, error listeners)
- `src/app/app.routes.ts` — Route configuration
- `src/app/books/*` — Feature area for the books list

Routing
- Routes are declared in `app.routes.ts`:
  - `''` → `BookListComponent`
  - `**` → redirects to `''`
- A single top-level route is currently used; it can be extended with feature routes (e.g., `/books/:id`).

UI Layer
- Standalone components with inline imports per component.
- `BookListComponent` composes the list UI and delegates item rendering to `BookItemComponent`.
- Styling uses Tailwind utility classes alongside Angular Material (available in dependencies; currently the list view uses Tailwind).

Data Access
- `BookApiClient` encapsulates HTTP calls to the Books API.
- Uses Angular `HttpClient` returning `Observable<Book[]>`.
- Query parameters are built with `HttpParams` to keep the service pure and testable.

State & Reactivity
- Components subscribe to service Observables and manage minimal local state (`books`, `loading`, `searchTerm`).
- Dependencies include RxJS (used) and NgRx Signals / TanStack Query (available), but the current sample feature does not yet use global state stores or query caching libraries.
- Possible extension paths:
  - Introduce `@tanstack/angular-query-experimental` for request caching, retries, and background refresh.
  - Use `@ngrx/signals` or Angular Signals for derived UI state across multiple components.

Error & Logging
- Global error listeners are enabled via `provideBrowserGlobalErrorListeners()`.
- Component-level `try/catch` is not used with Observables; instead, error handling is done in the `subscribe({ error })` branch in `BookListComponent`.
- Consider adding an `HttpInterceptor` for cross-cutting concerns (errors, headers, logging) as the app grows.

SSR Considerations
- Packages for SSR are present (`@angular/ssr`, `@angular/platform-server`, `express`), enabling Angular Universal.
- The current dev flow runs CSR by default (`ng serve`). When enabling SSR:
  - Server renders routes on the Node.js side (Express), then hydrates on the client.
  - Avoid direct browser-only APIs in constructors; prefer Angular platform abstractions or guards.

Testing
- E2E tests use Playwright; a dev server is spawned and tests run against `http://localhost:4200`.
- Component and service unit tests can be added under `src` and executed with `ng test`.

Non-functional aspects
- Formatting: Prettier enforced via `npm run format.write`.
- Performance: Event coalescing enabled; consider route-level code splitting and OnPush change detection on complex components.
