import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DesignSystemStudio, PrimitiveBox } from '../src/DesignSystemStudio';

vi.mock('../src/actions', () => ({
  updateDesignTokenAction: vi.fn(async (_prev: unknown, formData: FormData) => ({
    status: 'success',
    data: {
      id: 'tok_1',
      name: String(formData.get('name')),
      category: 'color',
      cssVar: '--ds-color-primary',
      value: String(formData.get('value')),
      roughness: 0.2,
      metalness: 0.8,
    },
  })),
}));

describe('Project 01: Enterprise Design System & 3D Shader Studio', () => {
  it('renders polymorphic PrimitiveBox as custom semantic element and switches active tokens', () => {
    render(
      <div>
        <PrimitiveBox as="a" href="https://example.com">
          Docs Link
        </PrimitiveBox>
        <DesignSystemStudio />
      </div>
    );

    const link = screen.getByText('Docs Link');
    expect(link.tagName).toBe('A');
    expect(screen.getByTestId('optimistic-hex').textContent).toBe('#38bdf8');

    const secondTokenBtn = screen.getByRole('button', { name: 'color.surface.elevated' });
    fireEvent.click(secondTokenBtn);
    expect(screen.getByTestId('optimistic-hex').textContent).toBe('#6366f1');
  });
});
