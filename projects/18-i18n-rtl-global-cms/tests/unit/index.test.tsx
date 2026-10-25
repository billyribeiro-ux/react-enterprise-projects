import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { InternationalizedCms } from '../../src/InternationalizedCms';

describe('18-i18n-rtl-global-cms', () => {
  it('switches direction between LTR and RTL', () => {
    render(<InternationalizedCms />);
    expect(screen.getByTestId('i18n-root')).toHaveAttribute('dir', 'ltr');
    fireEvent.click(screen.getByTestId('lang-ar'));
    expect(screen.getByTestId('i18n-root')).toHaveAttribute('dir', 'rtl');
  });
});