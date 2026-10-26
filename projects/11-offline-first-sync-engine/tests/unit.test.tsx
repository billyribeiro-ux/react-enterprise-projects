import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { OfflineSyncEngine } from '../src/OfflineSyncEngine';

describe('Project 11: Offline-First Local-First Sync Engine', () => {
  it('queues edits while offline and drains outbox into vector clock on reconnect', () => {
    render(<OfflineSyncEngine />);
    expect(screen.getByTestId('outbox-count').textContent).toBe('1');

    fireEvent.click(screen.getByRole('button', { name: /Commit Local Document Edit/i }));
    expect(screen.getByTestId('outbox-count').textContent).toBe('2');

    fireEvent.click(screen.getByRole('button', { name: /OFFLINE/i }));
    expect(screen.getByTestId('outbox-count').textContent).toBe('0');
    expect(screen.getByTestId('vector-clock').textContent).toBe('v3');
  });
});
