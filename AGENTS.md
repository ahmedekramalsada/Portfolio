# AGENTS.md — ahmed-os

## Commands (pnpm 9.15.0, node >=20; CI pins node 22)

- Install: `pnpm install --frozen-lockfile`
- All: `pnpm <dev|build|lint|test|typecheck>` (turbo). Single package: `pnpm --filter <name> <script>` (e.g. `pnpm --filter @ahmed-os/web typecheck`).
- CI verify order (`.github/workflows/cloudflare-deploy.yml`) — run before deploy-touching changes:
  `node --experimental-strip-types --test apps/web/src/config/seo.test.mjs apps/cloudflare-api/src/seo.test.mjs` (requires node ≥22 — the default `node` here is v20 and rejects the flag; use `/opt/homebrew/bin/node`) → `pnpm --filter @ahmed-os/web typecheck` → `pnpm --filter @ahmed-os/cloudflare-api typecheck` → `pnpm --filter @ahmed-os/web build:vinext` → `pnpm --filter @ahmed-os/cloudflare-api build`
- Format: `pnpm format` (prettier over ts/tsx/js/json/md).

## What actually ships (prod = Cloudflare Workers)

- `apps/cloudflare-api` — production API. Raw `fetch` router, all logic in `src/index.ts` (+ `auth.ts`/`http.ts`/`seo.ts`/`types.ts`). Bindings in `wrangler.jsonc`: D1 `DB` (`ahmed-os-content`), R2 `MEDIA`, vars (`SITE_URL`, `R2_PUBLIC_URL`, `ALLOWED_ORIGINS`). Secrets (`AUTH_SIGNING_KEY`) set via `wrangler secret put`, never in `wrangler.jsonc`. Dev: `wrangler dev`; build check: `pnpm --filter @ahmed-os/cloudflare-api build` (dry-run deploy).
- `apps/web` — Next 16 frontend deployed via vinext. Do NOT use `next build` for prod; use `pnpm --filter @ahmed-os/web build:vinext` then `wrangler deploy --config dist/server/wrangler.json --keep-vars` (see `deploy:vinext` script). `next.config.ts` rewrites `/sitemap.xml`, `/robots.txt`, `/feed.xml`, `/json-ld/*` to `SEO_API_URL`/`API_URL`.
- `apps/api` — NestJS + Prisma + Postgres. Local/legacy only; nothing in CI deploys it. Serves `/api/v1` on `:4000`, Swagger at `/api/docs`. Needs `docker compose up postgres redis` (defaults `ahmedos`/`ahmedos_dev`, ports 5432/6379) plus `DATABASE_URL` in `apps/api/.env`.
- Root `backend/`, `frontend/`, `ai/`, `infra/` are empty dead dirs — ignore.

## Database gotchas (two schemas, not in sync)

- Canonical for Nest: `apps/api/prisma/schema.prisma` (has `BlogPost.language`). Root `prisma/schema.prisma` is a stale superset (extra Knowledge/RAG models, missing `language`) with no script referencing it.
- Nest Prisma: run from the package scripts (`pnpm --filter @ahmed-os/api prisma:migrate|prisma:generate|prisma:seed`) — the `--schema=prisma/schema.prisma` path is already baked in, so run from repo root via filter.
- Worker D1 schema: `apps/cloudflare-api/migrations/0001_initial.sql` — managed via wrangler D1, never via `prisma migrate`.

## API conventions (`apps/cloudflare-api/src/index.ts`)

- Public reads are filtered server-side: posts → `status='published'` only; projects → `completed`/`in_progress` only; authed requests see drafts. Auth = `Authorization: Bearer <JWT>` (`requireAuth`/`optionalAuth` in `auth.ts`).
- All write handlers call `rejectUnknown` — any extra JSON field returns 400. Match `POST_PUBLIC_FIELDS` / `PROJECT_PUBLIC_FIELDS` exactly; responses use camelCase, DB columns snake_case.
- Media upload: max 10 MB multipart `file` field → R2 key `media/<id>-<name>`, public URL from `R2_PUBLIC_URL`. Contact POST has `website` honeypot — never send it filled.
- CORS allowlist is `ALLOWED_ORIGINS`; every response forces `Cache-Control: no-store` + `X-Frame-Options: DENY`.

## Testing

- Only meaningful tests: the two SEO suites (`apps/web/src/config/seo.test.mjs`, `apps/cloudflare-api/src/seo.test.mjs`) run with node:test, not jest/vitest. Keep `seo.ts` in both apps in sync — sitemap/feed/robots behavior is asserted in both.
- `apps/api` has `jest` configured (`pnpm --filter @ahmed-os/api test`) but negligible coverage; `apps/web` has no `test` script — `turbo test` will no-op there.

## Packages + TS

- `packages/types` is the only package with real code (`src/api.ts`, `models.ts`, `enums.ts`). `packages/sdk|config|ui|utils` are near-empty stubs — verify before importing.
- TS is strict with `noUnusedLocals` + `noUnusedParameters` (`tsconfig.base.json`) — unused vars fail `typecheck`.

## Docs vs code

- `docs/` (vision, stack, deployment…) is aspirational and stale — e.g. `20-deployment.md` describes Docker/Traefik, but real prod is Workers per the workflow + `wrangler.jsonc`. Trust executable config and `src/` over `docs/`.
- Dev secrets are already committed in `apps/api/.env` and root `.env` — never add real secrets; production values live in wrangler secrets / CI secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `AUTH_SIGNING_KEY`).
