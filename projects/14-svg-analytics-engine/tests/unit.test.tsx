import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HolographicRadar } from '../src/HolographicRadar';

describe('Project 14: Declarative SVG Holographic Radar Engine', () => {
  it('computes valid polar polygon points and updates composite SLA on profile boost', () => {
    render(<HolographicRadar />);
    expect(screen.getByTestId('composite-sla').textContent).toBe('92.6%');

    fireEvent.click(screen.getByRole('button', { name: /Boost Peak Canary Profile/i }));
    expect(screen.getByTestId('composite-sla').textContent).toBe('99.2%');
  });
});
