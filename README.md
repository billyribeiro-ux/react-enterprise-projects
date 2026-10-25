# Enterprise Full-Stack Suite &bull; React 19, Next.js, Node.js, Prisma ORM, Three.js & GSAP

[![Node.js LTS](https://img.shields.io/badge/Node.js-24%20LTS-brightgreen.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-12.14.0-orange.svg)](https://pnpm.io/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb.svg)](https://react.dev/)
[![Next.js](https://img.shields.io/badge/Next.js-App%20Router-black.svg)](https://nextjs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-v6%20SQLite%2FPostgres-2D3748.svg)](https://www.prisma.io/)
[![Three.js](https://img.shields.io/badge/Three.js-3D%20WebGL-blue.svg)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.12%20Kinetic-88CE02.svg)](https://greensock.com/gsap/)
[![Vitest](https://img.shields.io/badge/Vitest-Unit%20Tests-yellow.svg)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20A11y-purple.svg)](https://playwright.dev/)

A production-grade, enterprise-caliber suite of **20 full-stack projects** engineered to the highest standards of architectural excellence, sub-16ms INP, and WCAG 2.2 AAA compliance. Styled with Hollywood/Apple/Netflix cinematic visual flair, Three.js 3D spatial graphics, GSAP physics animations, and interactive follow-along course studio portal.

---

## 🏛️ Architectural Foundations

- **Package Manager**: Strictly **`pnpm`** (v12.14.0) with Turborepo task caching.
- **Runtimes**: Node.js **v24.22.0 LTS**.
- **Frontend Stack**: React 19 (Server Components, `useActionState`, `useOptimistic`, `use`), Next.js App Router (Streaming Suspense, Partial Prerendering - PPR), Vite 6.
- **Persistence Layer**: **Prisma ORM v6** with zero-config SQLite (`file:./dev.db`) for immediate local runs and seamless portability to PostgreSQL; client singleton pattern preventing pool exhaustion.
- **3D & Kinetic Motion**: Three.js WebGL shaders and PBR physical materials paired with GSAP 3.12 kinetic motion timelines.
- **Verification Engine**: Vitest for lightning-fast component testing + Playwright for end-to-end headless browser journeys.

---

## 🚀 The 20 Enterprise Projects

### **Tier 1: Enterprise Foundations & State Architectures**
- **`01-enterprise-design-system`**: Polymorphic accessible component library with Three.js 3D spatial material inspector and GSAP kinetic typography.
- **`02-saas-billing-dashboard`**: Apple Keynote/Netflix-style revenue telemetry with GSAP animated KPI counters and SVG circular progress dials.
- **`03-url-state-kanban`**: URL search params state synchronization (`nuqs`), drag-and-drop spring physics, and Prisma Task persistence.
- **`04-multi-step-wizard`**: 5-step enterprise onboarding wizard with Zod validation, auto-saving drafts to SQLite, and live compliance scoring.
- **`05-virtual-audit-feed`**: 100k+ item infinite virtual scroll feed with glowing severity matrix and cursor-based Prisma pagination.

### **Tier 2: Real-Time Systems, Concurrency & Stream Processing**
- **`06-realtime-collab-doc`**: CRDT-inspired real-time document editor with glowing presence avatars and optimistic block locking.
- **`07-crypto-order-book`**: Three.js 3D depth terrain mountains with WebGL shaders and Canvas 60fps order book visualizer.
- **`08-ai-streaming-copilot`**: Next.js App Router streaming Route Handler, React 19 `useOptimistic` chat interface, and token usage metrics.
- **`09-enterprise-rbac-auth`**: Zero-trust identity engine with PBKDF2 hashing, fine-grained permission matrix, and glowing security badges.
- **`10-web-audio-daw`**: Hollywood Sci-Fi WebGL 3D frequency ribbon undulating to synthetic waveforms with a 4-track step sequencer.

### **Tier 3: Distributed Architectures, Offline-First & Resilient Caching**
- **`11-offline-pwa-notes`**: Local-first Markdown knowledge base with IndexedDB offline persistence and bidirectional sync.
- **`12-ecommerce-ppr-storefront`**: Sub-10ms Partial Prerendering (PPR) storefront combining static prerendered shells with streaming inventory.
- **`13-distributed-job-queue`**: BullMQ-style background worker telemetry in SQLite with dead-letter queue (DLQ) and auto-retries.
- **`14-svg-analytics-engine`**: Cyberpunk reactive vector SVG charting engine with zero external chart library overhead and glowing radar rings.
- **`15-resumable-file-vault`**: Three.js 3D rotating cryptographic vault cylinders with SHA-256 chunked streaming and pause/resume.

### **Tier 4: Enterprise Capstones, High-Scale Edge & Federated Systems**
- **`16-micro-frontend-federation`**: Host container shell dynamically loading isolated remote micro-apps with shared React 19 runtime singletons.
- **`17-stripe-webhook-engine`**: Idempotent payment pipeline with HMAC-SHA256 signature verification and replay attack prevention.
- **`18-i18n-rtl-global-cms`**: Internationalized CMS with dynamic Arabic/Hebrew RTL mirroring and ICU message formatting.
- **`19-inverted-search-engine`**: High-performance full-text search engine with BM25 relevance scoring and tokenized inverted posting lists.
- **`20-cloud-observability-os`**: Datadog/CloudWatch caliber telemetry platform with interactive Three.js 3D global cluster mesh and APM flamegraphs.

---

## 🎨 Master Interactive Follow-Along Course Studio Portal

Launch the standalone interactive studio portal:
```bash
open index.html
# or serve via local webserver:
pnpm portal:serve
```

The portal provides:
- **Interactive Three.js 3D WebGL Background**: Responsive particle constellation and crystalline lattice.
- **Embedded Monaco Code Editor**: Syntax highlighting, copyable code, and instant multi-tab inspection.
- **5-Step Guided Blueprints**: Exact code, setup, and verification recipes so anyone can recreate every project from scratch.
- **Live 3D Simulation Viewport**: Run and interact with the 3D WebGL scenes, audio ribbons, and radar vector charts directly in the browser.
- **macOS `gh` CLI Cheatsheet**: Copy-ready commands for repo provisioning, PR management, and GitHub Actions CI.

---

## 💻 macOS GitHub CLI (`gh`) Automation Commands

```bash
# 1. Verify GitHub authentication status
pnpm gh:check
# (Runs: gh auth status)

# 2. Provision and publish to GitHub
pnpm gh:create
# (Runs: gh repo create billyribeiro-ux/react-enterprise-projects --public --source=. --remote=origin --push)

# 3. Monitor GitHub Actions CI status
pnpm gh:ci
# (Runs: gh run list --limit 5)

# 4. Automate PR creation
pnpm gh:pr
# (Runs: gh pr create --fill)
```

---

## 🧪 Testing Matrix

```bash
# Run Vitest unit & component specs across all projects
pnpm test

# Run Playwright end-to-end headless browser tests
pnpm test:e2e

# Run Prisma schema migrations and generate client
pnpm db:generate
pnpm db:push
pnpm db:seed
```

---

## 📄 License
MIT &bull; Authored by Billy Ribeiro
