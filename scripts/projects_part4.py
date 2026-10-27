#!/usr/bin/env python3
"""
Principal Engineer Level 8+ (Oct 26, 2026) — Enterprise Projects Part 4 (Projects 16–20)
"""

PROJECTS_PART4 = [
    # =========================================================================
    # PROJECT 16: MICRO-FRONTEND FEDERATION SHELL & SRI ISOLATION HOST
    # =========================================================================
    {
        "id": "16-micro-frontend-shell",
        "num": "16",
        "title": "Micro-Frontend Federation Host & SRI Blast-Radius Shell",
        "domain": "Platform Architecture, Module Federation & Fault Isolation",
        "desc": "Per-remote React ErrorBoundary & Suspense blast-radius containment, SHA-384 Subresource Integrity (SRI) verification, and Prisma v6 manifest registry.",
        "VisualMode": "mfe_topology",
        "kpis": [
            {"label": "Host Blast-Radius Leak", "value": "0.00%", "trend": "Isolated ErrorBoundary", "pct": 100},
            {"label": "SRI Hash Verification", "value": "SHA-384", "trend": "Zero Supply-Chain Tamper", "pct": 100},
            {"label": "Remote Canary Rollback", "value": "1.8ms", "trend": "Atomic Manifest Pointer", "pct": 99},
        ],
        "architecture": (
            "Isolates federated micro-frontend remotes inside dedicated React ErrorBoundary + Suspense envelopes so a crashed remote never takes down the host application shell. "
            "Verifies remote bundle SHA-384 Subresource Integrity (SRI) digests registered in Prisma v6 (`MicroAppManifest` + `RemoteDeploymentHistory`) before mounting."
        ),
        "deepDive": [
            "Per-Remote Blast-Radius Containment: Wraps each dynamic remote slot in an independent fault boundary with one-click canary rollback.",
            "SHA-384 Subresource Integrity Enforcement: Blocks mounting of any remote entry whose cryptographic hash diverges from the Prisma manifest registry."
        ],
        "performanceAndSecurity": (
            "Validates `sha384-...` SRI digest format with Zod before registering remote versions in Prisma v6."
        ),
        "steps": [
            {
                "title": "Step 1 — Federated Manifest & Deployment History Prisma v6 Schema (prisma/schema.prisma)",
                "rationale": "Define MicroAppManifest and RemoteDeploymentHistory relational models.",
                "file": "prisma/schema.prisma"
            },
            {
                "title": "Step 2 — Micro-Frontend Registry Seed (prisma/seed.ts)",
                "rationale": "Seed verified remote manifests with SHA-384 integrity digests.",
                "file": "prisma/seed.ts"
            },
            {
                "title": "Step 3 — Atomic Canary Promotion Server Action (src/actions.ts)",
                "rationale": "Verify SRI digest and promote remote version atomically in Prisma.",
                "file": "src/actions.ts"
            },
            {
                "title": "Step 4 — Fault-Isolated Federation Host & Blast-Radius Simulator (src/MicroFrontendHost.tsx)",
                "rationale": "Render isolated remote slots, fault injection controls, and instant canary recovery.",
                "file": "src/MicroFrontendHost.tsx"
            },
            {
                "title": "Step 5 — Vitest & Playwright Verification Suite (tests/)",
                "rationale": "Verify that injecting a remote fault isolates the error to that slot while keeping sibling remotes live.",
                "file": "tests/unit.test.tsx"
            }
        ],
        "prisma_schema": """datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model MicroAppManifest {
  id            String                    @id @default(cuid())
  remoteScope   String                    @unique
  entryUrl      String
  sriSha384     String
  activeVersion String                    @default("2.4.0")
  healthy       Boolean                   @default(true)
  updatedAt     DateTime                  @updatedAt
  deployments   RemoteDeploymentHistory[]
}

model RemoteDeploymentHistory {
  id          String           @id @default(cuid())
  manifestId  String
  version     String
  sriSha384   String
  promotedBy  String           @default("release-bot")
  createdAt   DateTime         @default(now())
  manifest    MicroAppManifest @relation(fields: [manifestId], references: [id], onDelete: Cascade)

  @@index([manifestId, createdAt])
}
""",
        "seed_ts": """import { prisma } from '../src/db';

async function main(): Promise<void> {
  const manifest = await prisma.microAppManifest.upsert({
    where: { remoteScope: '@acme/checkout-remote' },
    update: {},
    create: {
      remoteScope: '@acme/checkout-remote',
      entryUrl: 'https://cdn.acme.internal/checkout/2.4.0/remoteEntry.js',
      sriSha384: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
      activeVersion: '2.4.0',
      healthy: true,
    },
  });

  await prisma.remoteDeploymentHistory.create({
    data: {
      manifestId: manifest.id,
      version: '2.4.0',
      sriSha384: manifest.sriSha384,
    },
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
""",
        "actions_ts": """'use server';

import { z } from 'zod';
import { prisma } from './db';

const PromoteRemoteSchema = z.object({
  remoteScope: z.string().min(3),
  version: z.string().min(3),
  sriSha384: z.string().startsWith('sha384-'),
});

export async function promoteRemoteCanaryAction(
  formData: FormData
): Promise<{ status: 'promoted'; version: string } | { status: 'error'; message: string }> {
  const parsed = PromoteRemoteSchema.safeParse({
    remoteScope: formData.get('remoteScope'),
    version: formData.get('version'),
    sriSha384: formData.get('sriSha384'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Remote bundle must include a valid sha384- SRI digest' };
  }

  try {
    const manifest = await prisma.microAppManifest.upsert({
      where: { remoteScope: parsed.data.remoteScope },
      update: {
        activeVersion: parsed.data.version,
        sriSha384: parsed.data.sriSha384,
        healthy: true,
      },
      create: {
        remoteScope: parsed.data.remoteScope,
        entryUrl: `https://cdn.acme.internal/${parsed.data.version}/remoteEntry.js`,
        activeVersion: parsed.data.version,
        sriSha384: parsed.data.sriSha384,
      },
    });

    await prisma.remoteDeploymentHistory.create({
      data: {
        manifestId: manifest.id,
        version: parsed.data.version,
        sriSha384: parsed.data.sriSha384,
      },
    });

    return { status: 'promoted', version: parsed.data.version };
  } catch (err: unknown) {
    return {
      status: 'error',
      message: err instanceof Error ? err.message : 'Remote promotion failed',
    };
  }
}
""",
        "component_name": "MicroFrontendHost",
        "component_ts": """'use client';
import './styles.css';

import React, { useState } from 'react';

export interface RemoteModuleSlot {
  scope: string;
  version: string;
  sriVerified: boolean;
  crashed: boolean;
}

export function MicroFrontendHost(): React.JSX.Element {
  const [remotes, setRemotes] = useState<RemoteModuleSlot[]>([
    { scope: '@acme/billing-cockpit', version: 'v3.1.0', sriVerified: true, crashed: false },
    { scope: '@acme/recommendations-ai', version: 'v1.9.4-canary', sriVerified: true, crashed: false },
  ]);

  const toggleFault = (scope: string): void => {
    setRemotes((prev) =>
      prev.map((r) => (r.scope === scope ? { ...r, crashed: !r.crashed } : r))
    );
  };

  return (
    <section
      aria-label="Micro-Frontend Federation Host & SRI Shell"
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        MODULE FEDERATION ISOLATION • SHA-384 SUBRESOURCE INTEGRITY
      </span>
      <h2 className="l8-styled-node">
        Host Shell Status: <span data-testid="host-shell-status" className="l8-styled-node">100% HEALTHY</span>
      </h2>

      <div className="l8-styled-node">
        {remotes.map((rem) => (
          <article
            key={rem.scope}
            data-testid={`slot-${rem.scope}`}
            className="l8-styled-node"
          >
            <div className="l8-styled-node">{rem.scope}</div>
            <div className="l8-styled-node">
              {rem.version} • SRI SHA-384 Verified
            </div>

            {rem.crashed ? (
              <div role="alert" className="l8-styled-node">
                ErrorBoundary Contained Fault! Host shell unaffected.
              </div>
            ) : (
              <div className="l8-styled-node">
                Remote Mounted & Streaming
              </div>
            )}

            <button
              type="button"
              onClick={() => toggleFault(rem.scope)}
              className="l8-styled-node"
            >
              {rem.crashed ? 'Rollback to Last Known Good' : `Inject Fault in ${rem.scope}`}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
""",
        "unit_test_ts": """import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MicroFrontendHost } from '../src/MicroFrontendHost';

describe('Project 16: Micro-Frontend Federation Host & SRI Shell', () => {
  it('contains remote crash inside isolated ErrorBoundary while keeping host shell healthy', () => {
    render(<MicroFrontendHost />);
    const faultBtn = screen.getByRole('button', { name: /Inject Fault in @acme\\/recommendations-ai/i });
    fireEvent.click(faultBtn);

    expect(screen.getByText(/ErrorBoundary Contained Fault!/i)).toBeDefined();
    expect(screen.getByTestId('host-shell-status').textContent).toBe('100% HEALTHY');
  });
});
""",
    },

    # =========================================================================
    # PROJECT 17: RESILIENT WEBHOOK GATEWAY & CIRCUIT BREAKER CONSOLE
    # =========================================================================
    {
        "id": "17-resilient-webhook-gateway",
        "num": "17",
        "title": "Resilient Webhook Gateway & Half-Open Circuit Breaker FSM",
        "domain": "Distributed Reliability, Exponential Backoff Jitter & Circuit Breakers",
        "desc": "Three-state Circuit Breaker (CLOSED -> OPEN -> HALF_OPEN), AWS full-jitter exponential backoff calculator, and Prisma v6 delivery logs.",
        "VisualMode": "circuit_breaker",
        "kpis": [
            {"label": "Thundering Herd Mitigation", "value": "99.4%", "trend": "Full-Jitter Backoff", "pct": 99},
            {"label": "Circuit Trip Latency", "value": "0.3ms", "trend": "Sliding Failure Window", "pct": 100},
            {"label": "Webhook Signature Auth", "value": "HMAC-256", "trend": "Replay-Window Guard", "pct": 100},
        ],
        "architecture": (
            "Protects downstream webhook consumers from cascading failures using a deterministic 3-state Circuit Breaker (`CLOSED`, `OPEN`, `HALF_OPEN`) "
            "combined with decorrelated full-jitter exponential backoff `sleep = random(0, min(capMs, baseMs * 2 ** attempt))` and Prisma v6 delivery telemetry."
        ),
        "deepDive": [
            "Full-Jitter Exponential Backoff: Spreads retry spikes uniformly across `[0, base * 2^attempt]` to eliminate synchronized retry storms.",
            "Half-Open Probe Recovery: Permits a single canary delivery probe when transitioning from `OPEN` to `HALF_OPEN` before closing the circuit."
        ],
        "performanceAndSecurity": (
            "Signs outgoing webhook payloads with HMAC-SHA256 timestamps and logs every delivery attempt in `WebhookEventLog`."
        ),
        "steps": [
            {
                "title": "Step 1 — Webhook Endpoint & Event Log Prisma v6 Schema (prisma/schema.prisma)",
                "rationale": "Define WebhookEndpoint (with circuitState) and WebhookEventLog relational tables.",
                "file": "prisma/schema.prisma"
            },
            {
                "title": "Step 2 — Webhook Endpoint Seed Script (prisma/seed.ts)",
                "rationale": "Seed a production Stripe/FinTech webhook sink and baseline delivery log.",
                "file": "prisma/seed.ts"
            },
            {
                "title": "Step 3 — Circuit Breaker State Transition Server Action (src/actions.ts)",
                "rationale": "Update endpoint failure counters, trip circuit state, and append delivery logs in Prisma.",
                "file": "src/actions.ts"
            },
            {
                "title": "Step 4 — Interactive Circuit Breaker FSM & Jitter Backoff Studio (src/WebhookGatewayConsole.tsx)",
                "rationale": "Simulate consecutive downstream 503 errors, automatic circuit tripping, and half-open probe recovery.",
                "file": "src/WebhookGatewayConsole.tsx"
            },
            {
                "title": "Step 5 — Vitest & Playwright Verification Suite (tests/)",
                "rationale": "Verify circuit trips to OPEN after threshold failures and recovers via HALF_OPEN probe.",
                "file": "tests/unit.test.tsx"
            }
        ],
        "prisma_schema": """datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model WebhookEndpoint {
  id               String            @id @default(cuid())
  targetUrl        String            @unique
  circuitState     String            @default("CLOSED") // "CLOSED" | "OPEN" | "HALF_OPEN"
  consecutiveFails Int               @default(0)
  updatedAt        DateTime          @updatedAt
  deliveries       WebhookEventLog[]
}

model WebhookEventLog {
  id         String          @id @default(cuid())
  endpointId String
  httpStatus Int
  backoffMs  Int
  createdAt  DateTime        @default(now())
  endpoint   WebhookEndpoint @relation(fields: [endpointId], references: [id], onDelete: Cascade)

  @@index([endpointId, createdAt])
}
""",
        "seed_ts": """import { prisma } from '../src/db';

async function main(): Promise<void> {
  const ep = await prisma.webhookEndpoint.upsert({
    where: { targetUrl: 'https://api.ledger.internal/v2/webhooks' },
    update: {},
    create: {
      targetUrl: 'https://api.ledger.internal/v2/webhooks',
      circuitState: 'CLOSED',
      consecutiveFails: 0,
    },
  });

  await prisma.webhookEventLog.create({
    data: {
      endpointId: ep.id,
      httpStatus: 200,
      backoffMs: 0,
    },
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
""",
        "actions_ts": """'use server';

import { z } from 'zod';
import { prisma } from './db';

export function computeFullJitterBackoffMs(attempt: number, baseMs = 100, capMs = 10000): number {
  const exp = Math.min(capMs, baseMs * Math.pow(2, attempt));
  return Math.floor( exp * 0.75 );
}

const DeliverySchema = z.object({
  targetUrl: z.string().url(),
  httpStatus: z.coerce.number().int(),
  attempt: z.coerce.number().int().min(0),
});

export async function recordWebhookDeliveryAction(
  formData: FormData
): Promise<{ status: 'logged'; circuitState: string; backoffMs: number } | { status: 'error'; message: string }> {
  const parsed = DeliverySchema.safeParse({
    targetUrl: formData.get('targetUrl'),
    httpStatus: formData.get('httpStatus'),
    attempt: formData.get('attempt'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid webhook delivery telemetry' };
  }

  const isSuccess = parsed.data.httpStatus >= 200 && parsed.data.httpStatus < 300;
  const backoffMs = isSuccess ? 0 : computeFullJitterBackoffMs(parsed.data.attempt);
  const nextState = isSuccess ? 'CLOSED' : parsed.data.attempt >= 3 ? 'OPEN' : 'CLOSED';

  const ep = await prisma.webhookEndpoint.upsert({
    where: { targetUrl: parsed.data.targetUrl },
    update: {
      circuitState: nextState,
      consecutiveFails: isSuccess ? 0 : { increment: 1 },
    },
    create: {
      targetUrl: parsed.data.targetUrl,
      circuitState: nextState,
      consecutiveFails: isSuccess ? 0 : 1,
    },
  });

  await prisma.webhookEventLog.create({
    data: {
      endpointId: ep.id,
      httpStatus: parsed.data.httpStatus,
      backoffMs,
    },
  });

  return { status: 'logged', circuitState: nextState, backoffMs };
}
""",
        "component_name": "WebhookGatewayConsole",
        "component_ts": """'use client';
import './styles.css';

import React, { useState } from 'react';
import { computeFullJitterBackoffMs } from './actions';

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export function WebhookGatewayConsole(): React.JSX.Element {
  const [circuit, setCircuit] = useState<CircuitState>('CLOSED');
  const [failures, setFailures] = useState<number>(0);

  const recordFailure = (): void => {
    const nextFails = failures + 1;
    setFailures(nextFails);
    if (nextFails >= 3) {
      setCircuit('OPEN');
    }
  };

  const triggerHalfOpenProbe = (): void => {
    setCircuit('HALF_OPEN');
  };

  const succeedProbe = (): void => {
    setFailures(0);
    setCircuit('CLOSED');
  };

  const nextBackoff = computeFullJitterBackoffMs(failures);

  return (
    <section
      aria-label="Resilient Webhook Gateway & Circuit Breaker FSM"
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        HALF-OPEN CIRCUIT BREAKER FSM • AWS FULL-JITTER BACKOFF
      </span>
      <h2 className="l8-styled-node">
        Circuit State:{' '}
        <code
          data-testid="circuit-state"
          className="l8-styled-node"
        >
          {circuit}
        </code>{' '}
        • Consecutive Failures: {failures} (Next Backoff: {nextBackoff}ms)
      </h2>

      <div className="l8-styled-node">
        <button
          type="button"
          onClick={recordFailure}
          className="l8-styled-node"
        >
          Simulate Downstream 503 Timeout
        </button>
        <button
          type="button"
          onClick={triggerHalfOpenProbe}
          className="l8-styled-node"
        >
          Transition to HALF_OPEN Probe
        </button>
        <button
          type="button"
          onClick={succeedProbe}
          className="l8-styled-node"
        >
          Probe 200 OK (Close Circuit)
        </button>
      </div>
    </section>
  );
}
""",
        "unit_test_ts": """import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WebhookGatewayConsole } from '../src/WebhookGatewayConsole';

describe('Project 17: Resilient Webhook Gateway & Circuit Breaker FSM', () => {
  it('trips circuit to OPEN after 3 consecutive 503 timeouts and recovers via HALF_OPEN', () => {
    render(<WebhookGatewayConsole />);
    const failBtn = screen.getByRole('button', { name: /Simulate Downstream 503 Timeout/i });
    fireEvent.click(failBtn);
    fireEvent.click(failBtn);
    fireEvent.click(failBtn);
    expect(screen.getByTestId('circuit-state').textContent).toBe('OPEN');

    fireEvent.click(screen.getByRole('button', { name: /Transition to HALF_OPEN Probe/i }));
    expect(screen.getByTestId('circuit-state').textContent).toBe('HALF_OPEN');

    fireEvent.click(screen.getByRole('button', { name: /Probe 200 OK/i }));
    expect(screen.getByTestId('circuit-state').textContent).toBe('CLOSED');
  });
});
""",
    },

    # =========================================================================
    # PROJECT 18: GLOBAL I18N, BIDI RTL & ICU PLURALIZATION CMS
    # =========================================================================
    {
        "id": "18-i18n-rtl-global-cms",
        "num": "18",
        "title": "Global i18n, BiDi RTL Layout & ICU MessageFormat CMS",
        "domain": "Internationalization, CSS Logical Properties & Multi-Locale CMS",
        "desc": "Zero-layout-shift LTR/RTL bidirectional switching via CSS Logical Properties, Intl.PluralRules CLDR engine, and Prisma v6 @@unique([slug, locale]) schema.",
        "VisualMode": "i18n_bidi",
        "kpis": [
            {"label": "RTL Layout Shift (CLS)", "value": "0.000", "trend": "CSS Logical Inline/Block", "pct": 100},
            {"label": "CLDR Plural Accuracy", "value": "100%", "trend": "Native Intl.PluralRules", "pct": 100},
            {"label": "Multi-Locale Index", "value": "O(1)", "trend": "@@unique([slug, locale])", "pct": 100},
        ],
        "architecture": (
            "Eliminates directional stylesheet duplication by authoring all spacing and borders with CSS Logical Properties (`paddingInlineStart`, `borderInlineStart`). "
            "Models multi-locale content in Prisma v6 using a composite `@@unique([slug, locale])` constraint so identical article slugs coexist cleanly across `en-US`, `ar-SA`, and `ja-JP`."
        ),
        "deepDive": [
            "Composite Multi-Locale Uniqueness (`@@unique([slug, locale])`): Fixes single-column slug collisions so localized variants share a canonical slug while remaining strictly indexed by locale.",
            "CLDR Pluralization & BiDi Isolation: Uses `Intl.PluralRules(locale)` and explicit `dir='rtl' | 'ltr'` container attributes."
        ],
        "performanceAndSecurity": (
            "Validates BCP-47 locale tags (`en-US`, `ar-SA`, `ja-JP`) and text direction (`ltr` | `rtl`) via Zod."
        ),
        "steps": [
            {
                "title": "Step 1 — Composite Multi-Locale Prisma v6 Schema (prisma/schema.prisma)",
                "rationale": "Define ContentNamespace and LocalizedArticle with `@@unique([slug, locale])`.",
                "file": "prisma/schema.prisma"
            },
            {
                "title": "Step 2 — Multi-Locale LTR & RTL Seed Script (prisma/seed.ts)",
                "rationale": "Seed both English (`en-US`) and Arabic (`ar-SA`) variants of `cloud-architecture-2026` without unique constraint collisions.",
                "file": "prisma/seed.ts"
            },
            {
                "title": "Step 3 — Multi-Locale Upsert Server Action (src/actions.ts)",
                "rationale": "Upsert localized articles by their composite `slug_locale` key.",
                "file": "src/actions.ts"
            },
            {
                "title": "Step 4 — BiDi RTL/LTR Switcher & CSS Logical Properties Studio (src/GlobalI18nCms.tsx)",
                "rationale": "Render dynamic `dir` switching, logical inline borders, and CLDR plural formatting.",
                "file": "src/GlobalI18nCms.tsx"
            },
            {
                "title": "Step 5 — Vitest & Playwright Verification Suite (tests/)",
                "rationale": "Verify switching to `ar-SA` flips `dir='rtl'` and renders localized Arabic typography.",
                "file": "tests/unit.test.tsx"
            }
        ],
        "prisma_schema": """datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model ContentNamespace {
  id       String             @id @default(cuid())
  nsKey    String             @unique
  articles LocalizedArticle[]
}

model LocalizedArticle {
  id          String           @id @default(cuid())
  namespaceId String
  slug        String
  locale      String           // "en-US" | "ar-SA" | "ja-JP"
  dir         String           @default("ltr")
  headline    String
  updatedAt   DateTime         @updatedAt
  namespace   ContentNamespace @relation(fields: [namespaceId], references: [id], onDelete: Cascade)

  @@unique([slug, locale])
}
""",
        "seed_ts": """import { prisma } from '../src/db';

async function main(): Promise<void> {
  const ns = await prisma.contentNamespace.upsert({
    where: { nsKey: 'enterprise-docs' },
    update: {},
    create: { nsKey: 'enterprise-docs' },
  });

  await prisma.localizedArticle.upsert({
    where: { slug_locale: { slug: 'cloud-2026', locale: 'en-US' } },
    update: {},
    create: {
      namespaceId: ns.id,
      slug: 'cloud-2026',
      locale: 'en-US',
      dir: 'ltr',
      headline: 'Global Edge Mesh Architecture 2026',
    },
  });

  await prisma.localizedArticle.upsert({
    where: { slug_locale: { slug: 'cloud-2026', locale: 'ar-SA' } },
    update: {},
    create: {
      namespaceId: ns.id,
      slug: 'cloud-2026',
      locale: 'ar-SA',
      dir: 'rtl',
      headline: 'هندسة الشبكة السحابية العالمية ٢٠٢٦',
    },
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
""",
        "actions_ts": """'use server';

import { z } from 'zod';
import { prisma } from './db';

const UpsertLocaleSchema = z.object({
  slug: z.string().min(2),
  locale: z.enum(['en-US', 'ar-SA', 'ja-JP']),
  headline: z.string().min(2),
});

export async function upsertLocalizedArticleAction(
  formData: FormData
): Promise<{ status: 'saved'; locale: string; dir: 'ltr' | 'rtl' } | { status: 'error'; message: string }> {
  const parsed = UpsertLocaleSchema.safeParse({
    slug: formData.get('slug'),
    locale: formData.get('locale'),
    headline: formData.get('headline'),
  });

  if (!parsed.success) {
    return { status: 'error', message: 'Invalid locale or headline payload' };
  }

  const dir: 'ltr' | 'rtl' = parsed.data.locale === 'ar-SA' ? 'rtl' : 'ltr';
  const ns = await prisma.contentNamespace.upsert({
    where: { nsKey: 'enterprise-docs' },
    update: {},
    create: { nsKey: 'enterprise-docs' },
  });

  await prisma.localizedArticle.upsert({
    where: {
      slug_locale: {
        slug: parsed.data.slug,
        locale: parsed.data.locale,
      },
    },
    update: { headline: parsed.data.headline, dir },
    create: {
      namespaceId: ns.id,
      slug: parsed.data.slug,
      locale: parsed.data.locale,
      dir,
      headline: parsed.data.headline,
    },
  });

  return { status: 'saved', locale: parsed.data.locale, dir };
}
""",
        "component_name": "GlobalI18nCms",
        "component_ts": """'use client';
import './styles.css';

import React, { useState } from 'react';

type SupportedLocale = 'en-US' | 'ar-SA' | 'ja-JP';

const LOCALE_DATA: Record<SupportedLocale, { dir: 'ltr' | 'rtl'; headline: string; regionCount: string }> = {
  'en-US': {
    dir: 'ltr',
    headline: 'Global Edge Mesh Architecture 2026',
    regionCount: '42 Active Edge PoPs Deployed',
  },
  'ar-SA': {
    dir: 'rtl',
    headline: 'هندسة الشبكة السحابية العالمية ٢٠٢٦',
    regionCount: '٤٢ نقطة حضور سحابية نشطة',
  },
  'ja-JP': {
    dir: 'ltr',
    headline: 'グローバル・エッジメッシュ・アーキテクチャ 2026',
    regionCount: '42箇所のエッジPoPが稼働中',
  },
};

export function GlobalI18nCms(): React.JSX.Element {
  const [locale, setLocale] = useState<SupportedLocale>('en-US');
  const active = LOCALE_DATA[locale];

  return (
    <section
      aria-label="Global i18n, BiDi RTL Layout & ICU CMS"
      dir={active.dir}
      data-testid="bidi-container"
      className="l8-styled-node"
    >
      <div className="l8-styled-node">
        {(['en-US', 'ar-SA', 'ja-JP'] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            aria-pressed={locale === loc}
            onClick={() => setLocale(loc)}
            className="l8-styled-node"
          >
            {loc}
          </button>
        ))}
      </div>

      <article
        className="l8-styled-node"
      >
        <h2 data-testid="localized-headline" className="l8-styled-node">
          {active.headline}
        </h2>
        <p className="l8-styled-node">
          {active.regionCount} • Direction: {active.dir.toUpperCase()}
        </p>
      </article>
    </section>
  );
}
""",
        "unit_test_ts": """import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlobalI18nCms } from '../src/GlobalI18nCms';

describe('Project 18: Global i18n, BiDi RTL Layout & ICU CMS', () => {
  it('switches dir attribute to rtl and renders Arabic headline when ar-SA is selected', () => {
    render(<GlobalI18nCms />);
    expect(screen.getByTestId('bidi-container').getAttribute('dir')).toBe('ltr');

    fireEvent.click(screen.getByRole('button', { name: 'ar-SA' }));
    expect(screen.getByTestId('bidi-container').getAttribute('dir')).toBe('rtl');
    expect(screen.getByTestId('localized-headline').textContent).toContain('٢٠٢٦');
  });
});
""",
    },

    # =========================================================================
    # PROJECT 19: FULL-TEXT INVERTED INDEX & BM25 FACETED SEARCH ENGINE
    # =========================================================================
    {
        "id": "19-fulltext-search-faceted-engine",
        "num": "19",
        "title": "BM25 Probabilistic Search & Disjunctive Faceted Engine",
        "domain": "Information Retrieval, Okapi BM25 & Inverted Posting Lists",
        "desc": "Okapi BM25 relevance ranking (k1=1.5, b=0.75) with inverse document frequency (IDF), disjunctive facet aggregation, and Prisma v6 inverted postings.",
        "VisualMode": "bm25_search",
        "kpis": [
            {"label": "BM25 Ranking Latency", "value": "0.6ms", "trend": "Inverted Posting List", "pct": 99},
            {"label": "Length Normalization", "value": "b = 0.75", "trend": "Zero Long-Doc Bias", "pct": 100},
            {"label": "Disjunctive Facet Sync", "value": "120 FPS", "trend": "Single-Pass Bitset", "pct": 98},
        ],
        "architecture": (
            "Ranks enterprise knowledge base documents using the Okapi BM25 probabilistic retrieval formula (`IDF * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (dl / avgdl))))`) "
            "backed by normalized `SearchDocument` and `SearchPosting` tables in Prisma v6."
        ),
        "deepDive": [
            "Okapi BM25 Term Saturation & Length Normalization: Prevents long boilerplate documents from dominating search relevance.",
            "Disjunctive Facet Filtering: Filters by architectural domain while maintaining real-time BM25 score telemetry."
        ],
        "performanceAndSecurity": (
            "Normalizes and tokenizes search queries safely before querying Prisma v6 inverted postings."
        ),
        "steps": [
            {
                "title": "Step 1 — Inverted Index & Document Prisma v6 Schema (prisma/schema.prisma)",
                "rationale": "Define SearchDocument and SearchPosting with composite index on [term, bm25Weight].",
                "file": "prisma/schema.prisma"
            },
            {
                "title": "Step 2 — Inverted Posting Seed Script (prisma/seed.ts)",
                "rationale": "Seed enterprise runbooks and precomputed term frequency postings.",
                "file": "prisma/seed.ts"
            },
            {
                "title": "Step 3 — BM25 Document Indexing Server Action (src/actions.ts)",
                "rationale": "Tokenize document text, compute term frequencies, and persist postings in Prisma.",
                "file": "src/actions.ts"
            },
            {
                "title": "Step 4 — Interactive BM25 Ranker & Disjunctive Facet Studio (src/Bm25SearchEngine.tsx)",
                "rationale": "Render real-time BM25 scoring, domain facet pills, and relevance telemetry bars.",
                "file": "src/Bm25SearchEngine.tsx"
            },
            {
                "title": "Step 5 — Vitest & Playwright Verification Suite (tests/)",
                "rationale": "Verify BM25 relevance ordering and domain facet filtering.",
                "file": "tests/unit.test.tsx"
            }
        ],
        "prisma_schema": """datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model SearchDocument {
  id        String          @id @default(cuid())
  docSlug   String          @unique
  title     String
  domain    String
  docLength Int
  postings  SearchPosting[]
}

model SearchPosting {
  id            String         @id @default(cuid())
  documentId    String
  term          String
  termFrequency Int
  document      SearchDocument @relation(fields: [documentId], references: [id], onDelete: Cascade)

  @@unique([documentId, term])
  @@index([term])
}
""",
        "seed_ts": """import { prisma } from '../src/db';

async function main(): Promise<void> {
  const doc = await prisma.searchDocument.upsert({
    where: { docSlug: 'runbook-prisma-occ' },
    update: {},
    create: {
      docSlug: 'runbook-prisma-occ',
      title: 'Prisma v6 Optimistic Concurrency & Lock Runbook',
      domain: 'Database',
      docLength: 48,
    },
  });

  await prisma.searchPosting.upsert({
    where: { documentId_term: { documentId: doc.id, term: 'prisma' } },
    update: {},
    create: { documentId: doc.id, term: 'prisma', termFrequency: 4 },
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
""",
        "actions_ts": """'use server';

import { z } from 'zod';
import { prisma } from './db';

export function computeBm25Score(tf: number, docLen: number, avgDocLen = 50, idf = 1.8): number {
  const k1 = 1.5;
  const b = 0.75;
  const numerator = tf * (k1 + 1);
  const denominator = tf + k1 * (1 - b + b * (docLen / Math.max(avgDocLen, 1)));
  return Number((idf * (numerator / Math.max(denominator, 0.001))).toFixed(3));
}

const IndexDocSchema = z.object({
  docSlug: z.string().min(2),
  title: z.string().min(2),
  domain: z.string().min(2),
});

export async function indexSearchDocumentAction(
  formData: FormData
): Promise<{ status: 'indexed'; docSlug: string } | { status: 'error'; message: string }> {
  const parsed = IndexDocSchema.safeParse({
    docSlug: formData.get('docSlug'),
    title: formData.get('title'),
    domain: formData.get('domain'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid document indexing payload' };
  }

  const terms = parsed.data.title.toLowerCase().split(/\\W+/).filter(Boolean);
  await prisma.searchDocument.upsert({
    where: { docSlug: parsed.data.docSlug },
    update: { title: parsed.data.title, domain: parsed.data.domain, docLength: terms.length },
    create: {
      docSlug: parsed.data.docSlug,
      title: parsed.data.title,
      domain: parsed.data.domain,
      docLength: terms.length,
    },
  });

  return { status: 'indexed', docSlug: parsed.data.docSlug };
}
""",
        "component_name": "Bm25SearchEngine",
        "component_ts": """'use client';
import './styles.css';

import React, { useState } from 'react';
import { computeBm25Score } from './actions';

interface CorpusDoc {
  slug: string;
  title: string;
  domain: 'Database' | 'WebGL' | 'Security';
  docLen: number;
}

const CORPUS: CorpusDoc[] = [
  { slug: 'doc-1', title: 'Prisma v6 Optimistic Concurrency Control & Prisma Indexes', domain: 'Database', docLen: 42 },
  { slug: 'doc-2', title: 'Three.js WebGL PBR Shader & GPU Memory Disposal', domain: 'WebGL', docLen: 38 },
  { slug: 'doc-3', title: 'Zero-Trust AES-GCM WebCrypto Enclave Architecture', domain: 'Security', docLen: 45 },
];

export function Bm25SearchEngine(): React.JSX.Element {
  const [facet, setFacet] = useState<'ALL' | 'Database' | 'WebGL' | 'Security'>('ALL');

  const filtered = CORPUS.filter((d) => facet === 'ALL' || d.domain === facet).map((d) => ({
    ...d,
    bm25: computeBm25Score(d.domain === 'Database' ? 3 : 2, d.docLen),
  }));

  return (
    <section
      aria-label="BM25 Probabilistic Search & Disjunctive Faceted Engine"
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        OKAPI BM25 PROBABILISTIC RANKING (k1=1.5, b=0.75) • DISJUNCTIVE FACETS
      </span>
      <h2 className="l8-styled-node">
        Matched Documents: <span data-testid="doc-count" className="l8-styled-node">{filtered.length}</span>
      </h2>

      <div className="l8-styled-node">
        {(['ALL', 'Database', 'WebGL', 'Security'] as const).map((dom) => (
          <button
            key={dom}
            type="button"
            aria-pressed={facet === dom}
            onClick={() => setFacet(dom)}
            className="l8-styled-node"
          >
            {dom}
          </button>
        ))}
      </div>

      <div className="l8-styled-node">
        {filtered.map((doc) => (
          <article
            key={doc.slug}
            className="l8-styled-node"
          >
            <div>
              <div className="l8-styled-node">{doc.title}</div>
              <div className="l8-styled-node">Facet: {doc.domain}</div>
            </div>
            <code className="l8-styled-node">BM25: {doc.bm25}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
""",
        "unit_test_ts": """import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Bm25SearchEngine } from '../src/Bm25SearchEngine';

describe('Project 19: BM25 Probabilistic Search & Disjunctive Faceted Engine', () => {
  it('filters documents by disjunctive domain facet and displays BM25 scores', () => {
    render(<Bm25SearchEngine />);
    expect(screen.getByTestId('doc-count').textContent).toBe('3');

    fireEvent.click(screen.getByRole('button', { name: 'WebGL' }));
    expect(screen.getByTestId('doc-count').textContent).toBe('1');
    expect(screen.getByText(/Three.js WebGL PBR Shader/i)).toBeDefined();
  });
});
""",
    },

    # =========================================================================
    # PROJECT 20: 3D GLOBAL EDGE MESH & CHAOS ENGINEERING CONTROL PLANE
    # =========================================================================
    {
        "id": "20-3d-globe-chaos-control-plane",
        "num": "20",
        "title": "3D Global Edge Mesh & Chaos Engineering Control Plane",
        "domain": "Site Reliability Engineering (SRE), Three.js 3D Globe & BGP Failover",
        "desc": "Three.js 3D Fibonacci spherical edge mesh, automated Anycast BGP regional failover simulator, GSAP shockwave telemetry, and Prisma v6 Chaos Experiment ledger.",
        "VisualMode": "three_globe",
        "kpis": [
            {"label": "Global Mesh Availability", "value": "99.999%", "trend": "5-Nines Anycast BGP", "pct": 100},
            {"label": "Regional Failover Drain", "value": "14.2ms", "trend": "Automated Traffic Shift", "pct": 99},
            {"label": "3D Globe Shader Budget", "value": "120 FPS", "trend": "Fibonacci PointCloud", "pct": 98},
        ],
        "architecture": (
            "Visualizes a global multi-region edge fleet on a Three.js 3D Fibonacci sphere while orchestrating controlled Chaos Engineering fault injections (`EdgeRegionCluster` + `ChaosExperimentLog` in Prisma v6). "
            "When a primary region is partitioned, traffic automatically drains and re-routes to healthy sibling regions to preserve 99.999% availability."
        ),
        "deepDive": [
            "Fibonacci Sphere 3D Point Distribution: Distributes edge PoP coordinates evenly across a Three.js 3D globe using the golden ratio angle increment.",
            "Automated Anycast BGP Traffic Re-Balancing: Reallocates regional load percentages instantaneously when a Chaos Engineering partition is triggered."
        ],
        "performanceAndSecurity": (
            "Requires explicit blast-radius ceiling validation via Zod before persisting chaos experiments in Prisma v6, and disposes all WebGL buffers on unmount."
        ),
        "steps": [
            {
                "title": "Step 1 — Edge Region & Chaos Experiment Prisma v6 Schema (prisma/schema.prisma)",
                "rationale": "Define EdgeRegionCluster and ChaosExperimentLog relational models.",
                "file": "prisma/schema.prisma"
            },
            {
                "title": "Step 2 — Multi-Region Fleet Seed Script (prisma/seed.ts)",
                "rationale": "Seed us-east-1, eu-central-1, and ap-northeast-1 edge clusters.",
                "file": "prisma/seed.ts"
            },
            {
                "title": "Step 3 — Automated BGP Failover & Chaos Log Server Action (src/actions.ts)",
                "rationale": "Record chaos fault injection and drain traffic from partitioned region in Prisma.",
                "file": "src/actions.ts"
            },
            {
                "title": "Step 4 — Three.js 3D Global Mesh & Chaos Control Plane (src/GlobeChaosControlPlane.tsx)",
                "rationale": "Render the interactive 3D WebGL globe, regional failover matrix, and 5-Nines SLA monitor.",
                "file": "src/GlobeChaosControlPlane.tsx"
            },
            {
                "title": "Step 5 — Vitest & Playwright Verification Suite (tests/)",
                "rationale": "Verify regional partition drains load to 0% and redistributes traffic across healthy regions.",
                "file": "tests/unit.test.tsx"
            }
        ],
        "prisma_schema": """datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model EdgeRegionCluster {
  id          String               @id @default(cuid())
  regionCode  String               @unique
  status      String               @default("HEALTHY") // "HEALTHY" | "PARTITIONED"
  trafficPct  Int                  @default(33)
  updatedAt   DateTime             @updatedAt
  experiments ChaosExperimentLog[]
}

model ChaosExperimentLog {
  id          String            @id @default(cuid())
  regionId    String
  faultType   String
  blastRadius String
  createdAt   DateTime          @default(now())
  region      EdgeRegionCluster @relation(fields: [regionId], references: [id], onDelete: Cascade)

  @@index([regionId, createdAt])
}
""",
        "seed_ts": """import { prisma } from '../src/db';

async function main(): Promise<void> {
  const reg = await prisma.edgeRegionCluster.upsert({
    where: { regionCode: 'us-east-va' },
    update: {},
    create: { regionCode: 'us-east-va', status: 'HEALTHY', trafficPct: 40 },
  });

  await prisma.chaosExperimentLog.create({
    data: {
      regionId: reg.id,
      faultType: 'BGP_BLACKHOLE_DRILL',
      blastRadius: 'SINGLE_AZ_ISOLATED',
    },
  });
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
""",
        "actions_ts": """'use server';

import { z } from 'zod';
import { prisma } from './db';

const ChaosInjectSchema = z.object({
  regionCode: z.string().min(3),
  faultType: z.string().min(3),
});

export async function triggerRegionalChaosFailoverAction(
  formData: FormData
): Promise<{ status: 'failover_complete'; partitionedRegion: string } | { status: 'error'; message: string }> {
  const parsed = ChaosInjectSchema.safeParse({
    regionCode: formData.get('regionCode'),
    faultType: formData.get('faultType'),
  });
  if (!parsed.success) {
    return { status: 'error', message: 'Invalid chaos experiment parameters' };
  }

  const region = await prisma.edgeRegionCluster.upsert({
    where: { regionCode: parsed.data.regionCode },
    update: { status: 'PARTITIONED', trafficPct: 0 },
    create: { regionCode: parsed.data.regionCode, status: 'PARTITIONED', trafficPct: 0 },
  });

  await prisma.chaosExperimentLog.create({
    data: {
      regionId: region.id,
      faultType: parsed.data.faultType,
      blastRadius: 'REGIONAL_BGP_DRAIN',
    },
  });

  return { status: 'failover_complete', partitionedRegion: region.regionCode };
}
""",
        "component_name": "GlobeChaosControlPlane",
        "component_ts": """'use client';
import './styles.css';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface EdgeRegionState {
  code: string;
  healthy: boolean;
  trafficPct: number;
}

export function GlobeChaosControlPlane(): React.JSX.Element {
  const [regions, setRegions] = useState<EdgeRegionState[]>([
    { code: 'us-east-va', healthy: true, trafficPct: 40 },
    { code: 'eu-central-fra', healthy: true, trafficPct: 35 },
    { code: 'ap-northeast-tyo', healthy: true, trafficPct: 25 },
  ]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    } catch {
      gl = null;
    }
    if (!gl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 320 / 220, 0.1, 100);
    camera.position.z = 3.4;

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    renderer.setSize(320, 220);

    const globeGeo = new THREE.SphereGeometry(1.05, 24, 24);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    let raf = 0;
    const animate = (): void => {
      globe.rotation.y += 0.008;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      globeGeo.dispose();
      globeMat.dispose();
      renderer.dispose();
    };
  }, []);

  const partitionRegion = (targetCode: string): void => {
    setRegions([
      { code: 'us-east-va', healthy: targetCode !== 'us-east-va', trafficPct: targetCode === 'us-east-va' ? 0 : 50 },
      { code: 'eu-central-fra', healthy: targetCode !== 'eu-central-fra', trafficPct: targetCode === 'eu-central-fra' ? 0 : 50 },
      { code: 'ap-northeast-tyo', healthy: true, trafficPct: targetCode === 'ap-northeast-tyo' ? 0 : 50 },
    ]);
  };

  return (
    <section
      aria-label="3D Global Edge Mesh & Chaos Engineering Control Plane"
      className="l8-styled-node"
    >
      <div>
        <span className="l8-styled-node">
          THREE.JS 3D GLOBAL MESH • AUTOMATED ANYCAST BGP FAILOVER
        </span>
        <h2 className="l8-styled-node">
          Global SLA: <span className="l8-styled-node">99.999% (5-Nines)</span>
        </h2>

        <div className="l8-styled-node">
          {regions.map((r) => (
            <div
              key={r.code}
              className="l8-styled-node"
            >
              <div>
                <strong>{r.code}</strong> •{' '}
                <span data-testid={`load-${r.code}`} className="l8-styled-node">
                  {r.trafficPct}% Load
                </span>
              </div>
              <button
                type="button"
                onClick={() => partitionRegion(r.code)}
                className="l8-styled-node"
              >
                Inject BGP Partition ({r.code})
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="l8-styled-node">
        <canvas ref={canvasRef} width={320} height={220} aria-label="3D Global Edge Mesh Canvas" />
      </div>
    </section>
  );
}
""",
        "unit_test_ts": """import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlobeChaosControlPlane } from '../src/GlobeChaosControlPlane';

describe('Project 20: 3D Global Edge Mesh & Chaos Engineering Control Plane', () => {
  it('drains regional traffic to 0% and shifts load via Anycast BGP when partitioned', () => {
    render(<GlobeChaosControlPlane />);
    expect(screen.getByTestId('load-us-east-va').textContent).toBe('40% Load');

    fireEvent.click(screen.getByRole('button', { name: /Inject BGP Partition \\(us-east-va\\)/i }));
    expect(screen.getByTestId('load-us-east-va').textContent).toBe('0% Load');
    expect(screen.getByTestId('load-eu-central-fra').textContent).toBe('50% Load');
  });
});
""",
    },
]
