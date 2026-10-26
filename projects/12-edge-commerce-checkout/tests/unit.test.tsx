import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EdgeCommerceCheckout } from '../src/EdgeCommerceCheckout';

describe('Project 12: Edge-First High-Concurrency Flash Sale Engine', () => {
  it('decrements inventory atomically and prevents overselling past zero', () => {
    render(<EdgeCommerceCheckout initialStock={2} />);
    const btn = screen.getByRole('button');
    fireEvent.click(btn);
    expect(screen.getByTestId('stock-remaining').textContent).toBe('1');

    fireEvent.click(btn);
    expect(screen.getByTestId('stock-remaining').textContent).toBe('0');
    expect(btn.hasAttribute('disabled')).toBe(true);
  });
});
