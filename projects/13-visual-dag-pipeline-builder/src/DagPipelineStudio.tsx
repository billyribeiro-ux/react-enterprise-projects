'use client';

import React, { useState } from 'react';
import { kahnTopologicalSort } from './actions';

const NODES = ['INGEST', 'NORMALIZE', 'EMBED', 'INDEX'];

export function DagPipelineStudio(): React.JSX.Element {
  const [edges, setEdges] = useState<[string, string][]>([
    ['INGEST', 'NORMALIZE'],
    ['NORMALIZE', 'EMBED'],
    ['EMBED', 'INDEX'],
  ]);
  const [cycleAlert, setCycleAlert] = useState<string | null>(null);

  const tryAddEdge = (from: string, to: string): void => {
    const candidate: [string, string][] = [...edges, [from, to]];
    const sorted = kahnTopologicalSort(NODES, candidate);
    if (!sorted) {
      setCycleAlert(`Blocked Cyclic Dependency: ${from} -> ${to} violates DAG acyclicity!`);
      return;
    }
    setCycleAlert(null);
    setEdges(candidate);
  };

  const currentOrder = kahnTopologicalSort(NODES, edges) ?? NODES;

  return (
    <section
      aria-label="Visual DAG Pipeline Builder & Kahn Topological Scheduler"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
        KAHN O(V+E) TOPOLOGICAL SCHEDULER • DEAD-LETTER ISOLATION
      </span>
      <h2 style={{ margin: '0.35rem 0', fontSize: '1.45rem', fontWeight: 800 }}>
        Topological Plan:{' '}
        <code data-testid="topo-order" style={{ color: '#4ade80' }}>
          {currentOrder.join(' → ')}
        </code>
      </h2>

      <svg
        viewBox="0 0 500 90"
        style={{ width: '100%', maxWidth: '600px', background: '#0f172a', borderRadius: '12px', margin: '1rem 0' }}
      >
        <path d="M 70 45 C 120 15, 150 75, 190 45" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 190 45 C 240 15, 270 75, 310 45" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        <path d="M 310 45 C 360 15, 390 75, 430 45" fill="none" stroke="#38bdf8" strokeWidth="2.5" />
        {NODES.map((n, i) => (
          <g key={n}>
            <circle cx={70 + i * 120} cy={45} r={18} fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
            <text x={70 + i * 120} y={80} textAnchor="middle" fill="#e2e8f0" fontSize="10" fontWeight="700">
              {n}
            </text>
          </g>
        ))}
      </svg>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button
          type="button"
          onClick={() => tryAddEdge('INDEX', 'INGEST')}
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
          Simulate Illegal Cycle Edge (INDEX → INGEST)
        </button>
      </div>

      {cycleAlert && (
        <p role="alert" data-testid="cycle-alert" style={{ color: '#f87171', marginTop: '0.85rem', fontWeight: 700 }}>
          {cycleAlert}
        </p>
      )}
    </section>
  );
}
