import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { OfflineNotesView } from '../../src/OfflineNotesView';

describe('11-offline-pwa-notes', () => {
  it('renders offline notes', () => {
    const notes = [{ id: '1', title: 'Local Note', content: 'Text', version: 1 }];
    render(<OfflineNotesView initialNotes={notes} />);
    expect(screen.getByTestId('offline-root')).toBeInTheDocument();
  });
});