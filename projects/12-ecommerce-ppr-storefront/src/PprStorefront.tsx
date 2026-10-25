'use client';
import React, { useState } from 'react';
import { buyProduct } from './actions';

export function PprStorefront({ products }: { products: any[] }) {
  const [cart, setCart] = useState(0);

  const handleOrder = async (id: string) => {
    setCart((c) => c + 1);
    await buyProduct(id);
  };

  return (
    <div className="ppr-storefront-root" data-testid="storefront-root">
      <header className="ppr-header">
        <h2>Sub-10ms Partial Prerendering (PPR) Flash Storefront</h2>
        <div className="cart-chip" data-testid="cart-badge">Cart: {cart}</div>
      </header>

      <div className="products-deck">
        {products.map((p) => (
          <div key={p.id} className="product-glass-card">
            <h3>{p.name}</h3>
            <p className="price">${(p.priceCents / 100).toFixed(2)}</p>
            <span className="stock">Stock: {p.stockQty} remaining</span>
            <button onClick={() => handleOrder(p.id)} className="btn-cinema-glow" data-testid={`buy-${p.id}`}>
              Instant Reserve & Checkout →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}