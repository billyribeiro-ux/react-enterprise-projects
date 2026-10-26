import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BillingKpiDashboard } from '../src/BillingKpiDashboard';

describe('Project 02: Multi-Tenant SaaS Billing & Executive KPI Cockpit', () => {
  it('recalculates MRR and toggles aria-pressed when switching billing tiers', () => {
    render(<BillingKpiDashboard initialSeats={100} />);
    expect(screen.getByTestId('projected-mrr').textContent).toContain('$12,000/mo');

    const starterBtn = screen.getByRole('button', { name: /Starter Cloud/i });
    fireEvent.click(starterBtn);
    expect(starterBtn.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByTestId('projected-mrr').textContent).toContain('$4,900/mo');
  });
});
