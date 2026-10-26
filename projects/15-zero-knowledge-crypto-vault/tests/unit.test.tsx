import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ZeroKnowledgeVault } from '../src/ZeroKnowledgeVault';

describe('Project 15: Zero-Knowledge WebCrypto AES-GCM Vault', () => {
  it('seals plaintext into an opaque AES-GCM ciphertext envelope without leaking plaintext', () => {
    render(<ZeroKnowledgeVault />);
    const input = screen.getByLabelText('Plaintext Secret Input');
    fireEvent.change(input, { target: { value: 'top-secret-token' } });
    fireEvent.click(screen.getByRole('button', { name: /Derive Key & Seal/i }));

    const cipher = screen.getByTestId('ciphertext-hex').textContent ?? '';
    expect(cipher.startsWith('aes256gcm_')).toBe(true);
    expect(cipher).not.toContain('top-secret-token');
  });
});
