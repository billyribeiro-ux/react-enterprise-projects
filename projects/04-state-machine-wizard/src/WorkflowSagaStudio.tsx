'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        DETERMINISTIC FINITE AUTOMATON • IDEMPOTENT SAGA CHECKPOINTS
      </span>
      <h2 className="l8-styled-node">
        Current DFA State: <code data-testid="dfa-state" className="l8-styled-node">{currentState}</code>
      </h2>

      {/* Directed SVG State Machine Graph */}
      <svg
        viewBox="0 0 520 110"
        className="l8-styled-node"
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

      <div className="l8-styled-node">
        <button
          type="button"
          onClick={handleAdvance}
          disabled={currentState === 'PROVISIONED'}
          className="l8-styled-node"
        >
          Commit Next Idempotent Checkpoint →
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="l8-styled-node"
        >
          Compensate & Reset Saga
        </button>
      </div>

      <div className="l8-styled-node">
        Audit Log: {history.join(' • ')}
      </div>
    </section>
  );
}
