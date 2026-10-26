import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DagPipelineStudio } from '../src/DagPipelineStudio';

describe('Project 13: Visual DAG Pipeline Builder & Kahn Scheduler', () => {
  it('computes topological order and rejects cyclic back-edges', () => {
    render(<DagPipelineStudio />);
    expect(screen.getByTestId('topo-order').textContent).toBe('INGEST → NORMALIZE → EMBED → INDEX');

    fireEvent.click(screen.getByRole('button', { name: /Simulate Illegal Cycle Edge/i }));
    expect(screen.getByTestId('cycle-alert').textContent).toContain('Blocked Cyclic Dependency');
  });
});
