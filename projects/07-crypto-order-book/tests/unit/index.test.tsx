import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThreeOrderBook } from '../../src/ThreeOrderBook';

describe('07-crypto-order-book', () => {
  it('renders Three.js canvas and pricing HUD', () => {
    render(<ThreeOrderBook />);
    expect(screen.getByTestId('orderbook-root')).toBeInTheDocument();
    expect(screen.getByTestId('orderbook-canvas')).toBeInTheDocument();
  });
});