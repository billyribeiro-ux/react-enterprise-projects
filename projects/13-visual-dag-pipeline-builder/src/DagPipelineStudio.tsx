'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        KAHN O(V+E) TOPOLOGICAL SCHEDULER • DEAD-LETTER ISOLATION
      </span>
      <h2 className="l8-styled-node">
        Topological Plan:{' '}
        <code data-testid="topo-order" className="l8-styled-node">
          {currentOrder.join(' → ')}
        </code>
      </h2>

      <svg
        viewBox="0 0 500 90"
        className="l8-styled-node"
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

      <div className="l8-styled-node">
        <button
          type="button"
          onClick={() => tryAddEdge('INDEX', 'INGEST')}
          className="l8-styled-node"
        >
          Simulate Illegal Cycle Edge (INDEX → INGEST)
        </button>
      </div>

      {cycleAlert && (
        <p role="alert" data-testid="cycle-alert" className="l8-styled-node">
          {cycleAlert}
        </p>
      )}
    </section>
  );
}
