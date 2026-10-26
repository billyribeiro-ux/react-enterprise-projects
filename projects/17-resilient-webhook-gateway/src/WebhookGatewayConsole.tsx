'use client';

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
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
        HALF-OPEN CIRCUIT BREAKER FSM • AWS FULL-JITTER BACKOFF
      </span>
      <h2 style={{ margin: '0.35rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
        Circuit State:{' '}
        <code
          data-testid="circuit-state"
          style={{
            color: circuit === 'CLOSED' ? '#4ade80' : circuit === 'OPEN' ? '#f87171' : '#facc15',
          }}
        >
          {circuit}
        </code>{' '}
        • Consecutive Failures: {failures} (Next Backoff: {nextBackoff}ms)
      </h2>

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        <button
          type="button"
          onClick={recordFailure}
          style={{
            padding: '0.65rem 1.1rem',
            borderRadius: '10px',
            background: '#f43f5e',
            color: '#f8fafc',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Simulate Downstream 503 Timeout
        </button>
        <button
          type="button"
          onClick={triggerHalfOpenProbe}
          style={{
            padding: '0.65rem 1.1rem',
            borderRadius: '10px',
            background: '#f59e0b',
            color: '#090d16',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Transition to HALF_OPEN Probe
        </button>
        <button
          type="button"
          onClick={succeedProbe}
          style={{
            padding: '0.65rem 1.1rem',
            borderRadius: '10px',
            background: '#10b981',
            color: '#090d16',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Probe 200 OK (Close Circuit)
        </button>
      </div>
    </section>
  );
}
