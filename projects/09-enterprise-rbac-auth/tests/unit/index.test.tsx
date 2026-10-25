import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { HolographicRbac } from '../../src/HolographicRbac';

describe('09-enterprise-rbac-auth', () => {
  it('renders zero-trust gateway and verifies access', () => {
    render(<HolographicRbac userEmail="principal@corp.io" />);
    expect(screen.getByTestId('rbac-root')).toBeInTheDocument();
    const btn = screen.getByTestId('btn-verify-access');
    fireEvent.click(btn);
    expect(screen.getByText(/ACCESS AUTHORIZED/i)).toBeInTheDocument();
  });
});