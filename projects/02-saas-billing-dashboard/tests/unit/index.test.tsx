import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { CinematicBillingDashboard } from '../../src/CinematicBillingDashboard';

describe('02-saas-billing-dashboard', () => {
  const mockTenant = { id: 't1', name: 'OmniCorp', planTier: 'enterprise', mrrCents: 4892100, netRetention: 138.4 };

  it('renders cinematic billing dashboard with KPI counters and radial gauge', () => {
    render(<CinematicBillingDashboard tenant={mockTenant} />);
    expect(screen.getByTestId('hollywood-billing')).toBeInTheDocument();
    expect(screen.getByTestId('mrr-counter')).toBeInTheDocument();
    expect(screen.getByTestId('ndr-counter')).toBeInTheDocument();
    expect(screen.getByText('OmniCorp • Revenue & Licensing Command HUD')).toBeInTheDocument();
  });
});