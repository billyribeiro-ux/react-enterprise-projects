import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThreeObservabilityOS } from '../../src/ThreeObservabilityOS';

describe('20-cloud-observability-os', () => {
  it('renders 3D globe canvas and APM flamegraph', () => {
    render(<ThreeObservabilityOS />);
    expect(screen.getByTestId('apm-root')).toBeInTheDocument();
    expect(screen.getByTestId('globe-canvas')).toBeInTheDocument();
    expect(screen.getByText('POST /v1/telemetry')).toBeInTheDocument();
  });
});