'use client';
import React, { useState } from 'react';

export function HolographicRadar({ points }: { points: any[] }) {
  const [active, setActive] = useState<any | null>(null);

  const w = 600;
  const h = 260;
  const pad = 30;
  const maxV = Math.max(...points.map((p) => p.value), 25);
  const minV = Math.min(...points.map((p) => p.value), 5);

  const getX = (i: number) => pad + (i / (points.length - 1)) * (w - 2 * pad);
  const getY = (v: number) => h - pad - ((v - minV) / (maxV - minV)) * (h - 2 * pad);

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(p.value)}`, '');

  return (
    <div className="holographic-radar-root" data-testid="radar-root">
      <header className="radar-header">
        <h2>Cyberpunk Reactive Vector SVG Engine &bull; Zero External Chart Bloat</h2>
        <span className="tooltip-readout">{active ? `Latency: ${active.value.toFixed(2)}ms` : 'Hover telemetry node'}</span>
      </header>

      <div className="svg-container">
        <svg width={w} height={h} className="vector-svg" data-testid="vector-svg">
          <defs>
            <linearGradient id="cyberGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path d={pathD} fill="none" stroke="url(#cyberGlow)" strokeWidth="3" />
          {points.map((p, i) => (
            <circle
              key={i}
              cx={getX(i)}
              cy={getY(p.value)}
              r="4.5"
              className="radar-dot"
              onMouseEnter={() => setActive(p)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
}