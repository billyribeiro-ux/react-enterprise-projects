'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <div>
        <span className="l8-styled-node">
          ZERO-DEPENDENCY POLAR SVG • TRIGONOMETRIC KPI MESH
        </span>
        <h2 className="l8-styled-node">
          Composite SLA Index: <span data-testid="composite-sla" className="l8-styled-node">{avgScore}%</span>
        </h2>

        <button
          type="button"
          onClick={() => setScores([100, 99, 98, 100, 99])}
          className="l8-styled-node"
        >
          Boost Peak Canary Profile (99.2%)
        </button>
      </div>

      <div className="l8-styled-node">
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
