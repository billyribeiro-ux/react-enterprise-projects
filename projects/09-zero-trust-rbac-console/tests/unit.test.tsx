import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ZeroTrustRbacConsole } from '../src/ZeroTrustRbacConsole';

describe('Project 09: Zero-Trust RBAC/ABAC Security Console', () => {
  it('toggles capability bitflags via bitwise XOR and updates binary telemetry', () => {
    render(<ZeroTrustRbacConsole initialMask={5} />);
    expect(screen.getByTestId('binary-mask').textContent).toBe('0b0101 (5)');

    const piiBtn = screen.getByRole('button', { name: /EXPORT_PII_VAULT/i });
    fireEvent.click(piiBtn);
    expect(screen.getByTestId('binary-mask').textContent).toBe('0b1101 (13)');
  });
});
