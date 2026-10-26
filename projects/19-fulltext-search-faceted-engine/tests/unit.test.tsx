import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Bm25SearchEngine } from '../src/Bm25SearchEngine';

describe('Project 19: BM25 Probabilistic Search & Disjunctive Faceted Engine', () => {
  it('filters documents by disjunctive domain facet and displays BM25 scores', () => {
    render(<Bm25SearchEngine />);
    expect(screen.getByTestId('doc-count').textContent).toBe('3');

    fireEvent.click(screen.getByRole('button', { name: 'WebGL' }));
    expect(screen.getByTestId('doc-count').textContent).toBe('1');
    expect(screen.getByText(/Three.js WebGL PBR Shader/i)).toBeDefined();
  });
});
