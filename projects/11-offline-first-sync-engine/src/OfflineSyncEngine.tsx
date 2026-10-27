'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <header className="l8-styled-node">
        <div>
          <span className="l8-styled-node">
            LOCAL-FIRST OUTBOX • MONOTONIC VECTOR CLOCK
          </span>
          <h2 className="l8-styled-node">
            Vector Clock: <code data-testid="vector-clock" className="l8-styled-node">v{vectorClock}</code> • Outbox:{' '}
            <span data-testid="outbox-count">{outbox.length}</span> queued
          </h2>
        </div>

        <button
          type="button"
          aria-pressed={isOnline}
          onClick={toggleNetworkAndFlush}
          className="l8-styled-node"
        >
          {isOnline ? 'Status: ONLINE (Synced)' : 'Status: OFFLINE (Click to Reconnect & Drain)'}
        </button>
      </header>

      <button
        type="button"
        onClick={queueMutation}
        className="l8-styled-node"
      >
        Commit Local Document Edit
      </button>
    </section>
  );
}
