import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { WebhookMonitor } from '../../src/WebhookMonitor';

describe('17-stripe-webhook-engine', () => {
  it('triggers webhook simulation', () => {
    render(<WebhookMonitor />);
    expect(screen.getByTestId('webhook-root')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('btn-sim-webhook'));
  });
});