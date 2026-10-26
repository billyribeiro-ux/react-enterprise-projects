'use client';

import React, { useState } from 'react';

export interface OutboxMutation {
  id: string;
  patch: string;
}

export function OfflineSyncEngine(): React.JSX.Element {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [vectorClock, setVectorClock] = useState<number>(1);
  const [outbox, setOutbox] = useState<OutboxMutation[]>([
    { id: 'mut-1', patch: 'Append CRDT section 2.1' },
  ]);

  const queueMutation = (): void => {
    const nextId = `mut-${outbox.length + 1}`;
    if (isOnline) {
      setVectorClock((c) => c + 1);
    } else {
      setOutbox((prev) => [...prev, { id: nextId, patch: `Offline delta #${prev.length + 1}` }]);
    }
  };

  const toggleNetworkAndFlush = (): void => {
    const nextOnline = !isOnline;
    setIsOnline(nextOnline);
    if (nextOnline && outbox.length > 0) {
      setVectorClock((c) => c + outbox.length);
      setOutbox([]);
    }
  };

  return (
    <section
      aria-label="Offline-First Local-First Sync & Outbox Engine"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
            LOCAL-FIRST OUTBOX • MONOTONIC VECTOR CLOCK
          </span>
          <h2 style={{ margin: '0.25rem 0', fontSize: '1.45rem', fontWeight: 800 }}>
            Vector Clock: <code data-testid="vector-clock" style={{ color: '#4ade80' }}>v{vectorClock}</code> • Outbox:{' '}
            <span data-testid="outbox-count">{outbox.length}</span> queued
          </h2>
        </div>

        <button
          type="button"
          aria-pressed={isOnline}
          onClick={toggleNetworkAndFlush}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            background: isOnline ? '#10b981' : '#f59e0b',
            color: '#090d16',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isOnline ? 'Status: ONLINE (Synced)' : 'Status: OFFLINE (Click to Reconnect & Drain)'}
        </button>
      </header>

      <button
        type="button"
        onClick={queueMutation}
        style={{
          padding: '0.65rem 1.15rem',
          borderRadius: '10px',
          background: '#38bdf8',
          color: '#090d16',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Commit Local Document Edit
      </button>
    </section>
  );
}
