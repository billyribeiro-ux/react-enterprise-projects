'use client';
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
