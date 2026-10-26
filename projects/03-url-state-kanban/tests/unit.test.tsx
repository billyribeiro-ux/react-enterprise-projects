import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KineticKanban } from '../src/KineticKanban';

describe('Project 03: URL-Synchronized Kinetic Kanban Engine', () => {
  it('advances a card across columns and updates sprint velocity points', () => {
    render(<KineticKanban />);
    expect(screen.getByTestId('done-points').textContent).toBe('5 pts');

    const advanceButtons = screen.getAllByRole('button', { name: /Advance/i });
    const inProgressAdvanceBtn = advanceButtons[1];
    if (inProgressAdvanceBtn) {
      fireEvent.click(inProgressAdvanceBtn);
    }
    expect(screen.getByTestId('done-points').textContent).toBe('10 pts');
  });
});
