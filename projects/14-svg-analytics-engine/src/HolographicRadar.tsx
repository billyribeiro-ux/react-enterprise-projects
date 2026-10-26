'use client';

import React, { useState } from 'react';

export function computePolarPolygon(scores: number[], cx = 110, cy = 110, maxR = 80): string {
  const count = Math.max(scores.length, 1);
  return scores
    .map((val, idx) => {
      const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
      const r = (Math.min(Math.max(val, 0), 100) / 100) * maxR;
      const x = (cx + r * Math.cos(angle)).toFixed(1);
      const y = (cy + r * Math.sin(angle)).toFixed(1);
      return `${x},${y}`;
    })
    .join(' ');
}

export function HolographicRadar(): React.JSX.Element {
  const [scores, setScores] = useState<number[]>([95, 88, 92, 98, 90]);
  const polygonPoints = computePolarPolygon(scores);
  const avgScore = (scores.reduce((a, b) => a + b, 0) / Math.max(scores.length, 1)).toFixed(1);

  return (
    <section
      aria-label="Declarative SVG Holographic Radar & KPI Engine"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.5rem',
      }}
    >
      <div>
        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
          ZERO-DEPENDENCY POLAR SVG • TRIGONOMETRIC KPI MESH
        </span>
        <h2 style={{ margin: '0.35rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
          Composite SLA Index: <span data-testid="composite-sla" style={{ color: '#4ade80' }}>{avgScore}%</span>
        </h2>

        <button
          type="button"
          onClick={() => setScores([100, 99, 98, 100, 99])}
          style={{
            marginTop: '1rem',
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            background: '#38bdf8',
            color: '#090d16',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Boost Peak Canary Profile (99.2%)
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', background: '#0f172a', borderRadius: '14px', padding: '1rem' }}>
        <svg width="220" height="220" viewBox="0 0 220 220" aria-label="Polar Radar Telemetry Chart">
          <circle cx="110" cy="110" r="80" fill="none" stroke="rgba(255,255,255,0.1)" />
          <circle cx="110" cy="110" r="50" fill="none" stroke="rgba(255,255,255,0.08)" />
          <polygon
            data-testid="radar-polygon"
            points={polygonPoints}
            fill="rgba(56, 189, 248, 0.28)"
            stroke="#38bdf8"
            strokeWidth="2.5"
          />
        </svg>
      </div>
    </section>
  );
}
