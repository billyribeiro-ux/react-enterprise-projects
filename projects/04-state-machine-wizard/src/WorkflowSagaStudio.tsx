'use client';

import React, { useState } from 'react';
import type { SagaState } from './actions';

const STATES: { id: SagaState; label: string; x: number }[] = [
  { id: 'IDENTITY_CHECK', label: '1. KYB Identity', x: 60 },
  { id: 'RISK_SCORING', label: '2. Actuarial Risk', x: 190 },
  { id: 'COMPLIANCE_LOCK', label: '3. Compliance Seal', x: 320 },
  { id: 'PROVISIONED', label: '4. Live Enclave', x: 450 },
];

const NEXT_STATE_MAP: Record<SagaState, SagaState | null> = {
  IDENTITY_CHECK: 'RISK_SCORING',
  RISK_SCORING: 'COMPLIANCE_LOCK',
  COMPLIANCE_LOCK: 'PROVISIONED',
  PROVISIONED: null,
};

export function WorkflowSagaStudio(): React.JSX.Element {
  const [currentState, setCurrentState] = useState<SagaState>('IDENTITY_CHECK');
  const [history, setHistory] = useState<string[]>(['INIT -> IDENTITY_CHECK']);

  const handleAdvance = (): void => {
    const next = NEXT_STATE_MAP[currentState];
    if (!next) return;
    setHistory((prev) => [...prev, `${currentState} -> ${next}`]);
    setCurrentState(next);
  };

  const handleReset = (): void => {
    setCurrentState('IDENTITY_CHECK');
    setHistory(['RESET -> IDENTITY_CHECK']);
  };

  return (
    <section
      aria-label="Distributed Saga Workflow & State Machine Studio"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
        DETERMINISTIC FINITE AUTOMATON • IDEMPOTENT SAGA CHECKPOINTS
      </span>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.35rem 0 1.25rem' }}>
        Current DFA State: <code data-testid="dfa-state" style={{ color: '#4ade80' }}>{currentState}</code>
      </h2>

      {/* Directed SVG State Machine Graph */}
      <svg
        viewBox="0 0 520 110"
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'rgba(15,23,42,0.75)',
          borderRadius: '14px',
          padding: '0.75rem',
          marginBottom: '1.25rem',
        }}
      >
        <line x1="60" y1="50" x2="450" y2="50" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
        {STATES.map((node) => {
          const active = node.id === currentState;
          return (
            <g key={node.id}>
              <circle
                cx={node.x}
                cy={50}
                r={active ? 22 : 16}
                fill={active ? '#38bdf8' : '#1e293b'}
                stroke={active ? '#f8fafc' : '#475569'}
                strokeWidth="3"
              />
              <text
                x={node.x}
                y={92}
                textAnchor="middle"
                fill={active ? '#38bdf8' : '#94a3b8'}
                fontSize="11"
                fontWeight="700"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={handleAdvance}
          disabled={currentState === 'PROVISIONED'}
          style={{
            padding: '0.65rem 1.25rem',
            borderRadius: '10px',
            background: currentState === 'PROVISIONED' ? '#334155' : '#38bdf8',
            color: '#090d16',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Commit Next Idempotent Checkpoint →
        </button>
        <button
          type="button"
          onClick={handleReset}
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '10px',
            background: 'transparent',
            color: '#e2e8f0',
            border: '1px solid rgba(255,255,255,0.2)',
            cursor: 'pointer',
          }}
        >
          Compensate & Reset Saga
        </button>
      </div>

      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
        Audit Log: {history.join(' • ')}
      </div>
    </section>
  );
}
