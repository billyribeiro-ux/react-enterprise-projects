import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MicroFrontendShell } from '../../src/MicroFrontendShell';

describe('16-micro-frontend-federation', () => {
  it('switches federated tabs', () => {
    render(<MicroFrontendShell />);
    expect(screen.getByTestId('mfe-root')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('tab-billing'));
    expect(screen.getByText(/BILLING/i)).toBeInTheDocument();
  });
});