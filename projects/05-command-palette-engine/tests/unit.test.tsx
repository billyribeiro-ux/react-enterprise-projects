import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CommandPaletteEngine } from '../src/CommandPaletteEngine';

describe('Project 05: Zero-Latency Command Palette & Omni-Search Engine', () => {
  it('filters commands via fuzzy scorer and executes on Enter key', () => {
    render(<CommandPaletteEngine />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'Canary' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(screen.getByTestId('executed-cmd').textContent).toBe('Deploy Production Canary');
  });
});
