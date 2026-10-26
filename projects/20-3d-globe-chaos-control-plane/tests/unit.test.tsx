import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlobeChaosControlPlane } from '../src/GlobeChaosControlPlane';

describe('Project 20: 3D Global Edge Mesh & Chaos Engineering Control Plane', () => {
  it('drains regional traffic to 0% and shifts load via Anycast BGP when partitioned', () => {
    render(<GlobeChaosControlPlane />);
    expect(screen.getByTestId('load-us-east-va').textContent).toBe('40% Load');

    fireEvent.click(screen.getByRole('button', { name: /Inject BGP Partition \(us-east-va\)/i }));
    expect(screen.getByTestId('load-us-east-va').textContent).toBe('0% Load');
    expect(screen.getByTestId('load-eu-central-fra').textContent).toBe('50% Load');
  });
});
