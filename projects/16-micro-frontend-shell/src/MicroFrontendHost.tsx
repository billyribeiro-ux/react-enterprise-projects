'use client';

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
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
        MODULE FEDERATION ISOLATION • SHA-384 SUBRESOURCE INTEGRITY
      </span>
      <h2 style={{ margin: '0.35rem 0 1.25rem', fontSize: '1.45rem', fontWeight: 800 }}>
        Host Shell Status: <span data-testid="host-shell-status" style={{ color: '#4ade80' }}>100% HEALTHY</span>
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {remotes.map((rem) => (
          <article
            key={rem.scope}
            data-testid={`slot-${rem.scope}`}
            style={{
              padding: '1.25rem',
              borderRadius: '14px',
              background: rem.crashed ? 'rgba(244, 63, 94, 0.14)' : 'rgba(15, 23, 42, 0.75)',
              border: rem.crashed ? '1px solid #f43f5e' : '1px solid rgba(56, 189, 248, 0.25)',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '1rem' }}>{rem.scope}</div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.3rem 0 0.85rem' }}>
              {rem.version} • SRI SHA-384 Verified
            </div>

            {rem.crashed ? (
              <div role="alert" style={{ color: '#f87171', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                ErrorBoundary Contained Fault! Host shell unaffected.
              </div>
            ) : (
              <div style={{ color: '#4ade80', fontSize: '0.82rem', marginBottom: '0.75rem' }}>
                Remote Mounted & Streaming
              </div>
            )}

            <button
              type="button"
              onClick={() => toggleFault(rem.scope)}
              style={{
                padding: '0.5rem 0.9rem',
                borderRadius: '8px',
                background: rem.crashed ? '#10b981' : '#f43f5e',
                color: '#090d16',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {rem.crashed ? 'Rollback to Last Known Good' : `Inject Fault in ${rem.scope}`}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
