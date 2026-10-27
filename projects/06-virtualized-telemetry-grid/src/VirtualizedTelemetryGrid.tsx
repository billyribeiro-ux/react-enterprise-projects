'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <header className="l8-styled-node">
        <div>
          <span className="l8-styled-node">
            100,000 LOG STREAMS • CONSTANT O(1) DOM FOOTPRINT
          </span>
          <h2 className="l8-styled-node">
            Windowed Slice: Rows {startIndex.toLocaleString()} – {endIndex.toLocaleString()}
          </h2>
        </div>

        <button
          type="button"
          aria-pressed={severityFilter === 'ERROR'}
          onClick={() => setSeverityFilter((prev) => (prev === 'ALL' ? 'ERROR' : 'ALL'))}
          className="l8-styled-node"
        >
          {severityFilter === 'ERROR' ? 'Showing ERROR Only' : 'Filter ERROR Traces'}
        </button>
      </header>

      <div
        data-testid="virtual-viewport"
        onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)}
        className="l8-styled-node"
      >
        <div className="l8-styled-node">
          {visibleRows.map((row) => (
            <div
              key={row.traceId}
              data-testid="virtual-row"
              className="l8-styled-node"
            >
              <span>#{row.index} • {row.traceId}</span>
              <span className="l8-styled-node">
                {row.severity}
              </span>
              <span className="l8-styled-node">{row.latency}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
