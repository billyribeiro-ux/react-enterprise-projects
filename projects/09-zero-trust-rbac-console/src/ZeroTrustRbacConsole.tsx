'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <header className="l8-styled-node">
        <span className="l8-styled-node">
          O(1) BITWISE CAPABILITY MATRIX • CRYPTOGRAPHIC AUDIT LEDGER
        </span>
        <h2 className="l8-styled-node">
          Active Capability Mask:{' '}
          <code data-testid="binary-mask" className="l8-styled-node">
            0b{mask.toString(2).padStart(4, '0')} ({mask})
          </code>
        </h2>
      </header>

      <div className="l8-styled-node">
        {CAPABILITIES.map((cap) => {
          const granted = hasCapability(mask, cap.bit);
          return (
            <button
              key={cap.code}
              type="button"
              aria-pressed={granted}
              onClick={() => toggleBit(cap.bit)}
              className="l8-styled-node"
            >
              <div className="l8-styled-node">{cap.code}</div>
              <div className="l8-styled-node">{cap.label}</div>
              <span
                className="l8-styled-node"
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
