import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ThreeVaultUploader } from '../../src/ThreeVaultUploader';

describe('15-resumable-file-vault', () => {
  it('renders 3D vault canvas', () => {
    render(<ThreeVaultUploader />);
    expect(screen.getByTestId('vault-root')).toBeInTheDocument();
    expect(screen.getByTestId('vault-canvas')).toBeInTheDocument();
  });
});