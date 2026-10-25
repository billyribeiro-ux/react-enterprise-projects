import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { PprStorefront } from '../../src/PprStorefront';

describe('12-ecommerce-ppr-storefront', () => {
  it('increments cart count upon checkout', () => {
    const products = [{ id: 'p1', name: 'Workstation', priceCents: 499900, stockQty: 5 }];
    render(<PprStorefront products={products} />);
    const btn = screen.getByTestId('buy-p1');
    fireEvent.click(btn);
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('Cart: 1');
  });
});