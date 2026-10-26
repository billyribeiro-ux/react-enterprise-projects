import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TradingOrderbookTerminal } from '../src/TradingOrderbookTerminal';

describe('Project 10: Algorithmic Trading Orderbook & 3D Depth Terminal', () => {
  it('ingests ticks into Float64Array ring buffer and updates mid-price', () => {
    render(<TradingOrderbookTerminal />);
    expect(screen.getByTestId('mid-price').textContent).toBe('$98450.00');

    fireEvent.click(screen.getByRole('button', { name: /Sweep Ask/i }));
    expect(screen.getByTestId('mid-price').textContent).toBe('$98462.50');
    expect(screen.getByTestId('fills-count').textContent).toBe('2');
  });
});
