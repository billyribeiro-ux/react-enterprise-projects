'use client';

import React, { useState } from 'react';

export const CAPABILITIES = [
  { code: 'READ_TELEMETRY', bit: 1 << 0, label: 'Read Cluster Telemetry (0b0001)' },
  { code: 'MUTATE_SCHEMA', bit: 1 << 1, label: 'Mutate Prisma Schema (0b0010)' },
  { code: 'ROTATE_KEYS', bit: 1 << 2, label: 'Rotate KMS Signing Keys (0b0100)' },
  { code: 'EXPORT_PII_VAULT', bit: 1 << 3, label: 'Export PII Vault (0b1000)' },
] as const;

export function hasCapability(mask: number, bit: number): boolean {
  return (mask & bit) === bit;
}

export function ZeroTrustRbacConsole({
  initialMask = 0b0101,
}: {
  initialMask?: number;
}): React.JSX.Element {
  const [mask, setMask] = useState<number>(initialMask);

  const toggleBit = (bit: number): void => {
    setMask((prev) => prev ^ bit);
  };

  return (
    <section
      aria-label="Zero-Trust RBAC/ABAC IAM & Security Policy Console"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <header style={{ marginBottom: '1.25rem' }}>
        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
          O(1) BITWISE CAPABILITY MATRIX • CRYPTOGRAPHIC AUDIT LEDGER
        </span>
        <h2 style={{ margin: '0.25rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
          Active Capability Mask:{' '}
          <code data-testid="binary-mask" style={{ color: '#4ade80' }}>
            0b{mask.toString(2).padStart(4, '0')} ({mask})
          </code>
        </h2>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
        {CAPABILITIES.map((cap) => {
          const granted = hasCapability(mask, cap.bit);
          return (
            <button
              key={cap.code}
              type="button"
              aria-pressed={granted}
              onClick={() => toggleBit(cap.bit)}
              style={{
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'left',
                border: granted ? '1px solid #4ade80' : '1px solid rgba(255,255,255,0.12)',
                background: granted ? 'rgba(74, 222, 128, 0.12)' : 'rgba(15, 23, 42, 0.7)',
                color: '#f8fafc',
                cursor: 'pointer',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cap.code}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '0.25rem 0' }}>{cap.label}</div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: granted ? '#4ade80' : '#f87171',
                }}
              >
                {granted ? 'GRANTED (ALLOW)' : 'DENIED (ZERO-TRUST)'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
