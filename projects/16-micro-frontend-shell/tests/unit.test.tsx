import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MicroFrontendHost } from '../src/MicroFrontendHost';

describe('Project 16: Micro-Frontend Federation Host & SRI Shell', () => {
  it('contains remote crash inside isolated ErrorBoundary while keeping host shell healthy', () => {
    render(<MicroFrontendHost />);
    const faultBtn = screen.getByRole('button', { name: /Inject Fault in @acme\/recommendations-ai/i });
    fireEvent.click(faultBtn);

    expect(screen.getByText(/ErrorBoundary Contained Fault!/i)).toBeDefined();
    expect(screen.getByTestId('host-shell-status').textContent).toBe('100% HEALTHY');
  });
});
