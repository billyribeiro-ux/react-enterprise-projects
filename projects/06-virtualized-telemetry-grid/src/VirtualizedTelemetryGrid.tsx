'use client';

import React, { useMemo, useState } from 'react';

const TOTAL_ROWS = 100_000;
const ROW_HEIGHT = 36;
const VIEWPORT_HEIGHT = 320;
const OVERSCAN = 3;

export function VirtualizedTelemetryGrid(): React.JSX.Element {
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'ERROR'>('ALL');

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - OVERSCAN);
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + OVERSCAN * 2;
  const endIndex = Math.min(TOTAL_ROWS - 1, startIndex + visibleCount);

  const visibleRows = useMemo(() => {
    const rows: { index: number; traceId: string; severity: string; latency: string }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      const isErr = i % 11 === 0;
      if (severityFilter === 'ERROR' && !isErr) continue;
      rows.push({
        index: i,
        traceId: `trc-${String(i).padStart(6, '0')}`,
        severity: isErr ? 'ERROR' : 'INFO',
        latency: `${(1.1 + (i % 17) * 0.35).toFixed(2)}ms`,
      });
    }
    return rows;
  }, [startIndex, endIndex, severityFilter]);

  return (
    <section
      aria-label="100k-Row Virtualized Telemetry Explorer"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
            100,000 LOG STREAMS • CONSTANT O(1) DOM FOOTPRINT
          </span>
          <h2 style={{ margin: '0.25rem 0', fontSize: '1.4rem', fontWeight: 800 }}>
            Windowed Slice: Rows {startIndex.toLocaleString()} – {endIndex.toLocaleString()}
          </h2>
        </div>

        <button
          type="button"
          aria-pressed={severityFilter === 'ERROR'}
          onClick={() => setSeverityFilter((prev) => (prev === 'ALL' ? 'ERROR' : 'ALL'))}
          style={{
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            background: severityFilter === 'ERROR' ? '#ef4444' : '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.15)',
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          {severityFilter === 'ERROR' ? 'Showing ERROR Only' : 'Filter ERROR Traces'}
        </button>
      </header>

      <div
        data-testid="virtual-viewport"
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        style={{
          height: `${VIEWPORT_HEIGHT}px`,
          overflowY: 'auto',
          position: 'relative',
          background: '#0f172a',
          borderRadius: '12px',
          border: '1px solid rgba(56, 189, 248, 0.2)',
        }}
      >
        <div style={{ height: `${TOTAL_ROWS * ROW_HEIGHT}px`, position: 'relative' }}>
          {visibleRows.map((row) => (
            <div
              key={row.traceId}
              data-testid="virtual-row"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: `${ROW_HEIGHT}px`,
                transform: `translate3d(0, ${row.index * ROW_HEIGHT}px, 0)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 1rem',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontFamily: 'monospace',
                fontSize: '0.82rem',
              }}
            >
              <span>#{row.index} • {row.traceId}</span>
              <span style={{ color: row.severity === 'ERROR' ? '#f87171' : '#38bdf8', fontWeight: 700 }}>
                {row.severity}
              </span>
              <span style={{ color: '#4ade80' }}>{row.latency}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
