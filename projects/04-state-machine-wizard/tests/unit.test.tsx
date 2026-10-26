import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { WorkflowSagaStudio } from '../src/WorkflowSagaStudio';

describe('Project 04: Distributed Saga Workflow & State Machine Studio', () => {
  it('transitions deterministically through DFA states until PROVISIONED', () => {
    render(<WorkflowSagaStudio />);
    expect(screen.getByTestId('dfa-state').textContent).toBe('IDENTITY_CHECK');

    const nextBtn = screen.getByRole('button', { name: /Commit Next Idempotent Checkpoint/i });
    fireEvent.click(nextBtn);
    expect(screen.getByTestId('dfa-state').textContent).toBe('RISK_SCORING');

    fireEvent.click(nextBtn);
    expect(screen.getByTestId('dfa-state').textContent).toBe('COMPLIANCE_LOCK');

    fireEvent.click(nextBtn);
    expect(screen.getByTestId('dfa-state').textContent).toBe('PROVISIONED');
  });
});
