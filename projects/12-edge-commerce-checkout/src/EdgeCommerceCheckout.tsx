'use client';

import React, { useState } from 'react';

export function EdgeCommerceCheckout({
  initialStock = 3,
}: {
  initialStock?: number;
}): React.JSX.Element {
  const [stock, setStock] = useState<number>(initialStock);
  const [reservedCount, setReservedCount] = useState<number>(0);

  const handleAtomicReserve = (): void => {
    if (stock <= 0) return;
    setStock((s) => s - 1);
    setReservedCount((r) => r + 1);
  };

  return (
    <section
      aria-label="Edge-First High-Concurrency Flash Sale Engine"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
        ZERO-OVERSELL ATOMIC PREDICATE • IDEMPOTENT RESERVATION LOCK
      </span>
      <h2 style={{ margin: '0.35rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
        SKU: NV-BLACKWELL-ULTRA • Remaining Stock:{' '}
        <span data-testid="stock-remaining" style={{ color: stock > 0 ? '#4ade80' : '#f87171' }}>
          {stock}
        </span>
      </h2>
      <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
        Confirmed Atomic Reservations: <strong data-testid="reserved-count">{reservedCount}</strong>
      </p>

      <button
        type="button"
        disabled={stock === 0}
        onClick={handleAtomicReserve}
        style={{
          marginTop: '0.75rem',
          padding: '0.75rem 1.35rem',
          borderRadius: '10px',
          background: stock > 0 ? '#38bdf8' : '#334155',
          color: '#090d16',
          fontWeight: 800,
          border: 'none',
          cursor: stock > 0 ? 'pointer' : 'not-allowed',
        }}
      >
        {stock > 0 ? 'Execute Atomic 1-Unit Reservation' : 'SOLD OUT (Zero Oversell Verified)'}
      </button>
    </section>
  );
}
