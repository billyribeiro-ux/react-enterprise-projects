import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GlobalI18nCms } from '../src/GlobalI18nCms';

describe('Project 18: Global i18n, BiDi RTL Layout & ICU CMS', () => {
  it('switches dir attribute to rtl and renders Arabic headline when ar-SA is selected', () => {
    render(<GlobalI18nCms />);
    expect(screen.getByTestId('bidi-container').getAttribute('dir')).toBe('ltr');

    fireEvent.click(screen.getByRole('button', { name: 'ar-SA' }));
    expect(screen.getByTestId('bidi-container').getAttribute('dir')).toBe('rtl');
    expect(screen.getByTestId('localized-headline').textContent).toContain('٢٠٢٦');
  });
});
