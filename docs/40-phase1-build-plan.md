# Ahmed OS — Phase 1 Build Plan
Version: 1.0
Status: Proposed
Target: Local Development Environment

---

## Overview

This plan builds the complete foundation for Ahmed OS on local macOS.

We use a hybrid approach:
- **Infrastructure** (PostgreSQL, Redis, Qdrant) → Docker Compose
- **Application** (Next.js, NestJS) → pnpm dev (hot reload for development)
- **Repo** → Local git in ~/ahmed-os/ (GitHub when you're ready)

---

## Prerequisites

Checklist before starting:

- [ ] Docker Desktop running on macOS
- [ ] Node.js 22+ available (current: 20.20.2 — upgrade may be needed)
- [ ] pnpm installed (npm i -g pnpm)

---

## Step 1: Initialize the Monorepo

**What:** Create the Turborepo structure with pnpm workspaces.

**Actions:**
1. `git init` in ~/ahmed-os/
2. Create `pnpm-workspace.yaml` with `apps/*` and `packages/*` as workspaces
3. Create root `package.json` with Turborepo and shared scripts
4. Create `turbo.json` with pipeline config (build, dev, lint, test)
5. Create `.gitignore` (node_modules, .env, dist, .next, prisma/generated)
6. Create `.npmrc` with strict engine checks

**Creates:**
- `pnpm-workspace.yaml`
- `package.json` (root)
- `turbo.json`
- `.gitignore`
- `.npmrc`

**Verify:** `pnpm install` runs without errors.

---

## Step 2: Scaffold apps/api — NestJS Backend

**What:** Create the NestJS backend with full TypeScript strict mode.

**Actions:**
1. `pnpm create nest apps/api` — or manual scaffold
2. Install dependencies:
   - `@nestjs/core`, `@nestjs/common`, `@nestjs/platform-express`
   - `@nestjs/config` — environment variables
   - `@nestjs/swagger` — OpenAPI docs
   - `@nestjs/schedule` — cron jobs
   - `@nestjs/bullmq` — queue system
   - `prisma`, `@prisma/client` — database ORM
   - `class-validator`, `class-transformer` — DTO validation
   - `@nestjs/passport`, `passport`, `passport-jwt` — auth
   - `@nestjs/throttler` — rate limiting
   - `helmet` — security headers
   - `pino`, `nestjs-pino` — logging
3. Configure `tsconfig.json` with strict mode: true
4. Create `src/main.ts` with:
   - Swagger setup at `/api/docs`
   - Global validation pipe (whitelist + forbidNonWhitelisted)
   - Global exception filter
   - Pino logger
   - CORS configuration (allow localhost:3000)
5. Create `src/app.module.ts` with:
   - ConfigModule (ENV validation)
   - ThrottlerModule
   - PrismaModule (global)
   - Health module
   - Auth module (placeholder)

**Creates:**
- `apps/api/package.json`
- `apps/api/tsconfig.json`
- `apps/api/src/main.ts`
- `apps/api/src/app.module.ts`
- `apps/api/nest-cli.json`

**Verify:** `pnpm --filter api dev` starts NestJS on port 4000 without errors.

---

## Step 3: Scaffold apps/web — Next.js Frontend

**What:** Create the Next.js 15 frontend with App Router, Tailwind v4, shadcn/ui.

**Actions:**
1. `pnpm create next-app apps/web --typescript --tailwind --eslint --app --src-dir`
2. Install dependencies:
   - `@radix-ui/*` (as needed by shadcn)
   - `lucide-react` — icons
   - `class-variance-authority`, `clsx`, `tailwind-merge` — shadcn deps
   - `zustand` — client state
   - `@tanstack/react-query` — server state
   - `next-themes` — dark/light mode
   - `react-hook-form`, `@hookform/resolvers`, `zod` — forms
   - `framer-motion` — animations
   - `recharts` — charts (admin)
   - `@tiptap/react`, `@tiptap/starter-kit` — editor
   - `lucide-react`
3. Initialize shadcn/ui: `pnpm dlx shadcn@latest init`
4. Add core shadcn components: button, card, dialog, input, dropdown-menu, table, tabs, badge, avatar, toast, skeleton, command, tooltip, breadcrumb
5. Create `src/app/layout.tsx` with:
   - Theme provider (next-themes)
   - TanStack Query provider
   - Global navigation shell
   - Metadata (SEO base)
6. Create route structure (placeholder pages):
   - `(public)/page.tsx` — Home
   - `(public)/about/page.tsx`
   - `(public)/projects/page.tsx`
   - `(public)/blog/page.tsx`
   - `(public)/resume/page.tsx`
   - `(public)/contact/page.tsx`
   - `(admin)/dashboard/page.tsx` — protected
   - `(admin)/login/page.tsx`
7. Create `src/services/api.ts` — Axios client with:
   - Base URL: http://localhost:4000/api/v1
   - JWT interceptor (auto-attach token from cookie)
   - Error interceptor (toast on 4xx/5xx)
   - Auth refresh interceptor

**Creates:**
- `apps/web/package.json`
- `apps/web/src/app/` — full route structure
- `apps/web/src/services/api.ts`
- `apps/web/components.json` — shadcn config
- `apps/web/src/components/ui/` — shadcn components
- `apps/web/src/providers/` — Theme, Query providers

**Verify:** `pnpm --filter web dev` starts Next.js on port 3000 showing the homepage.

---

## Step 4: Docker Compose — Infrastructure

**What:** Define PostgreSQL, Redis, and Qdrant as Docker services for local development.

**Actions:**
1. Create `docker/docker-compose.yml` with services:
   - **postgres**: postgres:17-alpine
     - Port: 5432
     - Volume: pgdata
     - Env: POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_DB
     - Healthcheck: pg_isready
   - **redis**: redis:7-alpine
     - Port: 6379
     - Volume: redisdata
     - Healthcheck: ping
   - **qdrant**: qdrant/qdrant
     - Port: 6333 (HTTP), 6334 (gRPC)
     - Volume: qdrant_storage
2. Create `docker/.env.example` — template for local env vars
3. Create `docker/init.sql` — create extensions (pg_trgm, uuid-ossp)
4. Create root `docker-compose.yml` that references `docker/docker-compose.yml`

**Creates:**
- `docker/docker-compose.yml`
- `docker/.env.example`
- `docker/init.sql`
- Root `docker-compose.yml` (symlink or reference)

**Verify:** `docker compose up -d` starts all 3 containers, healthchecks pass.

---

## Step 5: Prisma Schema & Migration

**What:** Define the full Prisma schema reconciling docs 05 and 37.

**Actions:**
1. Create `prisma/schema.prisma` with:
   - PostgreSQL provider
   - All models from doc 37: User, Session, BlogPost, Category, Tag, BlogRevision, Project, ProjectTechnology, Technology, Media, KnowledgeDocument, KnowledgeChunk, Embedding, AIConversation, AIMessage, Prompt, SearchQuery, AnalyticsEvent, Notification, Setting, AuditLog
   - Additional models from doc 05 not in doc 37: Contact, CaseStudy, Certificate, Experience, Skill, Page, Note
   - Enums: UserRole, PostStatus, ProjectStatus, etc.
   - Relations, indexes, unique constraints
2. Run `npx prisma generate` — generate Prisma client
3. Run `npx prisma migrate dev --name init` — create first migration
4. Create `prisma/seed.ts` with:
   - Admin user (email: admin@ahmedekram.site, password to be set)
   - Default settings
   - Sample categories (DevOps, Backend, Frontend, AI, Cloud, Docker, etc.)
   - Sample skill entries

**Creates:**
- `prisma/schema.prisma`
- `prisma/migrations/` — initial migration
- `prisma/seed.ts`
- `src/prisma/prisma.service.ts` — Prisma service for NestJS

**Verify:** `npx prisma db push` creates all tables in local PostgreSQL. `npx prisma db seed` creates admin user and seed data.

---

## Step 6: Shared Packages

**What:** Create the monorepo shared packages.

**Actions:**
1. **packages/types**: Shared TypeScript types/interfaces
   - API response types
   - DTO interfaces
   - Enums matching Prisma
   - tsconfig.json with declaration: true
2. **packages/config**: Shared configuration
   - ESLint config (root)
   - TypeScript base config
   - Prettier config
3. **packages/ui**: Shared UI components (if needed beyond shadcn)
   - Wrappers around shadcn for project-specific components
4. **packages/utils**: Shared utilities
   - Date formatting
   - Slug generation
   - String utilities
   - Validation helpers
5. **packages/sdk**: API SDK (shared client)
   - Type-safe API client
   - Reusable for MCP server, admin, external use

**Creates:**
- `packages/types/package.json` + source
- `packages/config/package.json` + configs
- `packages/utils/package.json` + source
- `packages/sdk/package.json` + source
- `packages/ui/package.json` + source

**Verify:** `pnpm build` builds all packages without errors.

---

## Step 7: Initial Git Commit

**What:** Save everything to version control.

**Actions:**
1. `git add .`
2. `git commit -m "feat: initial monorepo scaffold

- Turborepo + pnpm workspaces
- NestJS backend (apps/api)
- Next.js 15 frontend (apps/web)
- Docker Compose (PostgreSQL, Redis, Qdrant)
- Prisma schema with all models
- Shared packages (types, config, utils, sdk, ui)
- shadcn/ui components"`

**Verify:** Clean working directory, initial commit created.

---

## Step 8: First Smoke Test

**What:** Verify the entire stack works end-to-end.

**Actions:**
1. `docker compose up -d` — start infra
2. `npx prisma migrate dev` — run migrations
3. `npx prisma db seed` — seed data
4. `pnpm dev` — start frontend + backend
5. Verify:
   - http://localhost:3000 — Next.js homepage renders
   - http://localhost:4000/api/v1/health — API returns 200
   - http://localhost:4000/api/docs — Swagger loads
   - PostgreSQL has tables (npx prisma studio)
   - Redis responds (redis-cli ping)

**Verify:** All checks pass. Development environment is ready.

---

## After Phase 1 — What's Ready

```
~/ahmed-os/
├── apps/
│   ├── web/         Next.js 15 + shadcn/ui (localhost:3000)
│   └── api/         NestJS + Prisma (localhost:4000)
├── packages/
│   ├── types/       Shared types
│   ├── config/      Shared configs
│   ├── ui/          Shared components
│   ├── utils/       Shared utilities
│   └── sdk/         API SDK
├── docker/
│   └── docker-compose.yml  PostgreSQL + Redis + Qdrant
├── prisma/
│   ├── schema.prisma       All 25+ models
│   └── seed.ts             Admin user + sample data
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Resource Requirements

| Service | Local Port | Purpose |
|---------|-----------|---------|
| Next.js | 3000 | Frontend dev server |
| NestJS | 4000 | Backend API |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache / Queue |
| Qdrant | 6333 | Vector DB (HTTP) |
| Qdrant gRPC | 6334 | Vector DB (gRPC) |

---

## Duration Estimate

| Step | Time | 
|------|------|
| 1. Turborepo init | 10 min |
| 2. NestJS scaffold | 30 min |
| 3. Next.js scaffold | 45 min |
| 4. Docker Compose | 15 min |
| 5. Prisma schema | 60 min |
| 6. Shared packages | 30 min |
| 7. Git commit | 5 min |
| 8. Smoke test | 15 min |
| **Total** | **~3.5 hours** |
