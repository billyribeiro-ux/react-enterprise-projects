import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { SpatialTokenWorkbench } from '../../src/SpatialTokenWorkbench';

describe('01-enterprise-design-system: SpatialTokenWorkbench', () => {
  const mockTokens = [
    { id: 'tok-1', component: 'SpatialSphere', category: '3d-material', cssVariable: '--primary-glow', value: '#38bdf8', roughness: 0.1, metalness: 0.9 }
  ];

  it('renders Three.js spatial canvas and title', () => {
    render(<SpatialTokenWorkbench initialTokens={mockTokens} />);
    expect(screen.getByTestId('spatial-workbench')).toBeInTheDocument();
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument();
    expect(screen.getByText(/Apple\/Netflix Grade/i)).toBeInTheDocument();
  });

  it('allows editing color hex with optimistic propagation', () => {
    render(<SpatialTokenWorkbench initialTokens={mockTokens} />);
    const input = screen.getByTestId('color-input');
    fireEvent.change(input, { target: { value: '#ec4899' } });
    expect(screen.getByDisplayValue('#ec4899')).toBeInTheDocument();
  });
});