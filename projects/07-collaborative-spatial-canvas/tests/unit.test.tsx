import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SpatialCanvasStudio } from '../src/SpatialCanvasStudio';

describe('Project 07: Real-Time Collaborative 3D Spatial Canvas', () => {
  it('accepts higher Lamport timestamps and deterministically rejects stale packets', () => {
    render(<SpatialCanvasStudio />);
    expect(screen.getByTestId('spatial-coords').textContent).toContain('Vector3(0.5, 0.4, 0) • Lamport Clock: v10');

    fireEvent.click(screen.getByRole('button', { name: /Simulate Stale Packet/i }));
    expect(screen.getByTestId('spatial-coords').textContent).toContain('Lamport Clock: v10');

    fireEvent.click(screen.getByRole('button', { name: /Broadcast Valid Peer Transform/i }));
    expect(screen.getByTestId('spatial-coords').textContent).toContain('Vector3(1, 0.65, 0) • Lamport Clock: v11');
  });
});
