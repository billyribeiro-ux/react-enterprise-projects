# Bidirectional RTL/LTR Global Enterprise CMS

> **Tier**: Tier 4: Enterprise Capstones  
> **Tech Stack**: React 19, TypeScript, Next.js / Node.js 24 LTS, Prisma ORM, Three.js 3D, GSAP Motion, Vitest, Playwright, Vite

## Overview
Internationalized CMS with dynamic Arabic/Hebrew RTL mirroring, ICU pluralization message formatter, and Prisma localized content schemas.

## Architecture & Data Flow
1. **Visual Engine**: Three.js 3D WebGL renderers + GSAP kinetic easing timelines + 2D/3D reactive vector graphics.
2. **Data Layer**: Portable SQLite locally (`prisma/schema.prisma`), zero-config, portable to PostgreSQL.
3. **Server Actions / API**: Zod validation schemas with type-safe Prisma mutation.
4. **React 19 Frontend**: Server Components with optimistic UI updates (`useOptimistic`, `useActionState`).
5. **Testing Suite**: Vitest unit/component specs + Playwright E2E browser tests.

## Commands
```bash
# Generate Prisma Client
pnpm db:generate

# Push schema to SQLite
pnpm db:push

# Seed with enterprise mock records
pnpm db:seed

# Run Vitest unit tests
pnpm test

# Run Playwright E2E tests
pnpm test:e2e
```
