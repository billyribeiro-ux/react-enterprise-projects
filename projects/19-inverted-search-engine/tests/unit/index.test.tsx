import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { InvertedSearch } from '../../src/InvertedSearch';

describe('19-inverted-search-engine', () => {
  it('renders search bar', () => {
    render(<InvertedSearch />);
    expect(screen.getByTestId('search-root')).toBeInTheDocument();
  });
});