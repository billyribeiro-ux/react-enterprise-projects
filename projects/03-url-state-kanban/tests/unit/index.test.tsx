import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { KineticKanban } from '../../src/KineticKanban';

describe('03-url-state-kanban', () => {
  const mockCols = [
    { id: 'c1', title: 'To Do', tasks: [{ id: 't1', title: 'Card 1', priority: 'high' }] }
  ];

  it('renders kinetic kanban with tasks', () => {
    render(<KineticKanban initialColumns={mockCols} />);
    expect(screen.getByTestId('kanban-root')).toBeInTheDocument();
    expect(screen.getByText('Card 1')).toBeInTheDocument();
  });
});