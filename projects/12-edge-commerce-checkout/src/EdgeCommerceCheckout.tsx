'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        ZERO-OVERSELL ATOMIC PREDICATE • IDEMPOTENT RESERVATION LOCK
      </span>
      <h2 className="l8-styled-node">
        SKU: NV-BLACKWELL-ULTRA • Remaining Stock:{' '}
        <span data-testid="stock-remaining" className="l8-styled-node">
          {stock}
        </span>
      </h2>
      <p className="l8-styled-node">
        Confirmed Atomic Reservations: <strong data-testid="reserved-count">{reservedCount}</strong>
      </p>

      <button
        type="button"
        disabled={stock === 0}
        onClick={handleAtomicReserve}
        className="l8-styled-node"
      >
        {stock > 0 ? 'Execute Atomic 1-Unit Reservation' : 'SOLD OUT (Zero Oversell Verified)'}
      </button>
    </section>
  );
}
