import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { HolographicRadar } from '../../src/HolographicRadar';

describe('14-svg-analytics-engine', () => {
  it('renders SVG vector graph and dots', () => {
    const points = [{ value: 10 }, { value: 20 }];
    render(<HolographicRadar points={points} />);
    expect(screen.getByTestId('radar-root')).toBeInTheDocument();
    expect(screen.getByTestId('vector-svg')).toBeInTheDocument();
  });
});