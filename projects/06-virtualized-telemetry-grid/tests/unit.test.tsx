import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { VirtualizedTelemetryGrid } from '../src/VirtualizedTelemetryGrid';

describe('Project 06: 100k-Row Virtualized Telemetry Grid', () => {
  it('mounts fewer than 25 DOM rows for a 100,000 row dataset and updates on scroll', () => {
    render(<VirtualizedTelemetryGrid />);
    const renderedRows = screen.getAllByTestId('virtual-row');
    expect(renderedRows.length).toBeLessThan(25);

    const viewport = screen.getByTestId('virtual-viewport');
    fireEvent.scroll(viewport, { target: { scrollTop: 36000 } });
    expect(screen.getByText(/#1000 • trc-001000/i)).toBeDefined();
  });
});
