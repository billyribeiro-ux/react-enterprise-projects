import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WebhookGatewayConsole } from '../src/WebhookGatewayConsole';

describe('Project 17: Resilient Webhook Gateway & Circuit Breaker FSM', () => {
  it('trips circuit to OPEN after 3 consecutive 503 timeouts and recovers via HALF_OPEN', () => {
    render(<WebhookGatewayConsole />);
    const failBtn = screen.getByRole('button', { name: /Simulate Downstream 503 Timeout/i });
    fireEvent.click(failBtn);
    fireEvent.click(failBtn);
    fireEvent.click(failBtn);
    expect(screen.getByTestId('circuit-state').textContent).toBe('OPEN');

    fireEvent.click(screen.getByRole('button', { name: /Transition to HALF_OPEN Probe/i }));
    expect(screen.getByTestId('circuit-state').textContent).toBe('HALF_OPEN');

    fireEvent.click(screen.getByRole('button', { name: /Probe 200 OK/i }));
    expect(screen.getByTestId('circuit-state').textContent).toBe('CLOSED');
  });
});
